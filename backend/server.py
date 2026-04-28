from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path
from typing import List, Optional
from datetime import datetime
import os
import json
import base64
import logging

from models import (
    Vehicle, VehicleCreate, VehicleUpdate,
    Contact, ContactCreate,
    FinanceApplication, FinanceApplicationCreate,
    TradeIn,
    GlassRepair, GlassRepairCreate,
    SimpleContactRequest, SimpleContactRequestCreate,
    WarrantyAppointment, WarrantyAppointmentCreate,
    WarrantyInfoRequest, WarrantyInfoCreate,
    ScheduleVisit, ScheduleVisitCreate,
    Referral, ReferralCreate,
    PurchaseRequest,
    CarFinderRequest, CarFinderRequestCreate,
)
from admin_submissions import build_router as build_admin_router
from emails import notify_admin, notify_customer
from auth import build_auth_router, seed_admin

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
vehicles_collection = db.vehicles
contacts_collection = db.contacts
finance_applications_collection = db.finance_applications
trade_ins_collection = db.trade_ins
glass_repairs_collection = db.glass_repairs
service_requests_collection = db.service_requests
warranty_appointments_collection = db.warranty_appointments
warranty_info_collection = db.warranty_info_requests
schedule_visits_collection = db.schedule_visits
referrals_collection = db.referrals
purchase_requests_collection = db.purchase_requests
car_finder_requests_collection = db.car_finder_requests
users_collection = db.users


# File upload helpers
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


async def encode_upload(file: Optional[UploadFile]) -> Optional[dict]:
    """Read UploadFile, validate size, and return dict for MongoDB."""
    if file is None or not getattr(file, 'filename', None):
        return None
    data = await file.read()
    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail=f"File {file.filename} exceeds 5MB limit")
    return {
        "filename": file.filename,
        "contentType": file.content_type or 'application/octet-stream',
        "size": len(data),
        "base64": base64.b64encode(data).decode('utf-8'),
    }


# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Build auth router early so get_current_user dependency is available for protecting routes below
auth_router, get_current_user = build_auth_router(users_collection)
api_router.include_router(auth_router)


# ==================== HEALTH ====================
@api_router.get("/health")
async def health():
    return {"status": "ok"}


# ==================== VEHICLE ROUTES ====================

@api_router.get("/vehicles", response_model=List[Vehicle])
async def get_vehicles(
    bodyType: Optional[str] = None,
    make: Optional[str] = None,
    minYear: Optional[int] = None,
    maxYear: Optional[int] = None,
    maxPrice: Optional[float] = None,
    maxMileage: Optional[int] = None,
    featured: Optional[bool] = None
):
    query = {}
    if bodyType:
        query['bodyType'] = bodyType
    if make:
        query['make'] = make
    if minYear:
        query['year'] = {'$gte': minYear}
    if maxYear:
        if 'year' in query:
            query['year']['$lte'] = maxYear
        else:
            query['year'] = {'$lte': maxYear}
    if maxPrice:
        query['price'] = {'$lte': maxPrice}
    if maxMileage:
        query['mileage'] = {'$lte': maxMileage}
    if featured is not None:
        query['featured'] = featured

    vehicles = await vehicles_collection.find(query, {"_id": 0}).to_list(1000)
    return [Vehicle(**vehicle) for vehicle in vehicles]


@api_router.get("/vehicles/{vehicle_id}", response_model=Vehicle)
async def get_vehicle(vehicle_id: str):
    vehicle = await vehicles_collection.find_one({"id": vehicle_id}, {"_id": 0})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return Vehicle(**vehicle)


@api_router.post("/vehicles", response_model=Vehicle)
async def create_vehicle(vehicle: VehicleCreate, _user: dict = Depends(get_current_user)):
    vehicle_obj = Vehicle(**vehicle.dict())
    await vehicles_collection.insert_one(vehicle_obj.dict())
    return vehicle_obj


@api_router.post("/vehicles/upload", response_model=Vehicle)
async def create_vehicle_with_uploads(
    _user: dict = Depends(get_current_user),
    data: str = Form(..., description="JSON payload of vehicle fields"),
    images: List[UploadFile] = File(default=[]),
):
    """Create a vehicle, accepting multipart form-data with image file uploads.
    `data` must be a JSON string matching VehicleCreate schema.
    Uploaded files are base64-encoded and stored in the `images` list (data URIs).
    Existing URLs passed via data.images are preserved and combined with uploaded files."""
    try:
        payload = json.loads(data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="`data` field must be valid JSON")

    # Encode uploaded files as data URIs
    encoded_images: list = list(payload.get('images') or [])
    for upload in images:
        if not upload or not getattr(upload, 'filename', None):
            continue
        content = await upload.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail=f"Image {upload.filename} exceeds 5MB limit")
        content_type = upload.content_type or 'image/jpeg'
        encoded = base64.b64encode(content).decode('utf-8')
        encoded_images.append(f"data:{content_type};base64,{encoded}")
    payload['images'] = encoded_images
    if not payload.get('image') and encoded_images:
        payload['image'] = encoded_images[0]

    vehicle_obj = Vehicle(**VehicleCreate(**payload).dict())
    await vehicles_collection.insert_one(vehicle_obj.dict())
    return vehicle_obj


@api_router.put("/vehicles/{vehicle_id}/upload", response_model=Vehicle)
async def update_vehicle_with_uploads(
    vehicle_id: str,
    _user: dict = Depends(get_current_user),
    data: str = Form(..., description="JSON payload of vehicle update fields"),
    images: List[UploadFile] = File(default=[]),
):
    existing_vehicle = await vehicles_collection.find_one({"id": vehicle_id}, {"_id": 0})
    if not existing_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    try:
        payload = json.loads(data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="`data` field must be valid JSON")

    # Combine any URLs/data URIs in payload.images with newly uploaded files
    encoded_images: list = list(payload.get('images') or [])
    for upload in images:
        if not upload or not getattr(upload, 'filename', None):
            continue
        content = await upload.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail=f"Image {upload.filename} exceeds 5MB limit")
        content_type = upload.content_type or 'image/jpeg'
        encoded = base64.b64encode(content).decode('utf-8')
        encoded_images.append(f"data:{content_type};base64,{encoded}")
    payload['images'] = encoded_images
    if not payload.get('image') and encoded_images:
        payload['image'] = encoded_images[0]

    update_data = {k: v for k, v in payload.items() if v is not None}
    update_data['updatedAt'] = datetime.utcnow()
    await vehicles_collection.update_one({"id": vehicle_id}, {"$set": update_data})

    updated = await vehicles_collection.find_one({"id": vehicle_id}, {"_id": 0})
    return Vehicle(**updated)


@api_router.put("/vehicles/{vehicle_id}", response_model=Vehicle)
async def update_vehicle(vehicle_id: str, vehicle_update: VehicleUpdate, _user: dict = Depends(get_current_user)):
    existing_vehicle = await vehicles_collection.find_one({"id": vehicle_id}, {"_id": 0})
    if not existing_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    update_data = {k: v for k, v in vehicle_update.dict().items() if v is not None}
    if update_data:
        update_data['updatedAt'] = datetime.utcnow()
        await vehicles_collection.update_one({"id": vehicle_id}, {"$set": update_data})

    updated_vehicle = await vehicles_collection.find_one({"id": vehicle_id}, {"_id": 0})
    return Vehicle(**updated_vehicle)


@api_router.delete("/vehicles/{vehicle_id}")
async def delete_vehicle(vehicle_id: str, _user: dict = Depends(get_current_user)):
    result = await vehicles_collection.delete_one({"id": vehicle_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"message": "Vehicle deleted successfully"}


# ==================== CONTACT ROUTES ====================
@api_router.post("/contacts", response_model=Contact)
async def create_contact(contact: ContactCreate, background_tasks: BackgroundTasks):
    contact_obj = Contact(**contact.dict())
    await contacts_collection.insert_one(contact_obj.dict())
    data = contact_obj.dict()
    background_tasks.add_task(notify_admin, "Contact Inquiry", data)
    background_tasks.add_task(notify_customer, "Contact Inquiry", data)
    return contact_obj


@api_router.get("/contacts", response_model=List[Contact])
async def get_contacts():
    contacts = await contacts_collection.find({}, {"_id": 0}).to_list(1000)
    return [Contact(**contact) for contact in contacts]


# ==================== FINANCE APPLICATION ====================
@api_router.post("/finance-applications", response_model=FinanceApplication)
async def create_finance_application(application: FinanceApplicationCreate, background_tasks: BackgroundTasks):
    app_obj = FinanceApplication(**application.dict())
    await finance_applications_collection.insert_one(app_obj.dict())
    data = app_obj.dict()
    background_tasks.add_task(notify_admin, "Finance Application", data)
    background_tasks.add_task(notify_customer, "Finance Application", data)
    return app_obj


@api_router.get("/finance-applications", response_model=List[FinanceApplication])
async def get_finance_applications():
    applications = await finance_applications_collection.find({}, {"_id": 0}).to_list(1000)
    return [FinanceApplication(**app) for app in applications]


# ==================== TRADE-IN (multipart/form-data) ====================
@api_router.post("/trade-ins", response_model=TradeIn)
async def create_trade_in(
    background_tasks: BackgroundTasks,
    firstName: str = Form(...),
    lastName: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    year: str = Form(''),
    make: str = Form(''),
    model: str = Form(''),
    trim: str = Form(''),
    bodyStyle: str = Form(''),
    mileage: str = Form(''),
    vin: str = Form(''),
    exteriorColor: str = Form(''),
    interiorColor: str = Form(''),
    transmission: str = Form(''),
    drivetrain: str = Form(''),
    titleStatus: str = Form(''),
    lienHolder: str = Form(''),
    payoffAmount: str = Form(''),
    overallCondition: str = Form(''),
    accidentHistory: str = Form(''),
    mechanicalIssues: str = Form('[]'),
    modifications: str = Form(''),
    askingPrice: str = Form(''),
    comments: str = Form(''),
    photoExteriorFront: Optional[UploadFile] = File(None),
    photoExteriorRear: Optional[UploadFile] = File(None),
    photoExteriorDriver: Optional[UploadFile] = File(None),
    photoExteriorPassenger: Optional[UploadFile] = File(None),
    photoInteriorFront: Optional[UploadFile] = File(None),
    photoInteriorRear: Optional[UploadFile] = File(None),
):
    try:
        issues_list = json.loads(mechanicalIssues) if mechanicalIssues else []
    except json.JSONDecodeError:
        issues_list = []

    photos = {}
    for slot, upload in {
        'exteriorFront': photoExteriorFront,
        'exteriorRear': photoExteriorRear,
        'exteriorDriver': photoExteriorDriver,
        'exteriorPassenger': photoExteriorPassenger,
        'interiorFront': photoInteriorFront,
        'interiorRear': photoInteriorRear,
    }.items():
        encoded = await encode_upload(upload)
        if encoded is not None:
            photos[slot] = encoded

    trade_obj = TradeIn(
        firstName=firstName, lastName=lastName, email=email, phone=phone,
        year=year, make=make, model=model, trim=trim, bodyStyle=bodyStyle,
        mileage=mileage, vin=vin, exteriorColor=exteriorColor, interiorColor=interiorColor,
        transmission=transmission, drivetrain=drivetrain,
        titleStatus=titleStatus, lienHolder=lienHolder, payoffAmount=payoffAmount,
        overallCondition=overallCondition, accidentHistory=accidentHistory,
        mechanicalIssues=issues_list, modifications=modifications,
        askingPrice=askingPrice, comments=comments, photos=photos,
    )
    await trade_ins_collection.insert_one(trade_obj.dict())
    # Build email payload (exclude base64 blobs)
    data = trade_obj.dict()
    data_email = {**data, 'photos': {k: {"filename": v.get("filename"), "contentType": v.get("contentType"), "size": v.get("size")} for k, v in data.get('photos', {}).items()}}
    background_tasks.add_task(notify_admin, "Trade-In Request", data_email)
    background_tasks.add_task(notify_customer, "Trade-In Request", data_email)
    return trade_obj


@api_router.get("/trade-ins")
async def get_trade_ins():
    """Return trade-ins without base64 photo data to keep payload light."""
    trade_ins = await trade_ins_collection.find({}, {"_id": 0}).to_list(1000)
    # strip base64 for list view - keep only photo metadata
    for ti in trade_ins:
        if ti.get('photos'):
            ti['photos'] = {k: {"filename": v.get("filename"), "contentType": v.get("contentType"), "size": v.get("size")} for k, v in ti['photos'].items()}
    return trade_ins


# ==================== GLASS REPAIR (multipart) ====================
@api_router.post("/glass-repairs", response_model=GlassRepair)
async def create_glass_repair(
    background_tasks: BackgroundTasks,
    firstName: str = Form(...),
    lastName: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    year: str = Form(''),
    make: str = Form(''),
    model: str = Form(''),
    trim: str = Form(''),
    bodyStyle: str = Form(''),
    damageAreas: str = Form('[]'),
    damageType: str = Form(''),
    comments: str = Form(''),
    usingInsurance: str = Form(''),
    serviceLocation: str = Form(''),
    preferredDate: str = Form(''),
    preferredTime: str = Form(''),
    alternativeDate: str = Form(''),
    alternativeTime: str = Form(''),
    serviceAddress: str = Form(''),
    addressLine2: str = Form(''),
    city: str = Form(''),
    state: str = Form(''),
    zip: str = Form(''),
    damagePhoto: Optional[UploadFile] = File(None),
    insuranceCard: Optional[UploadFile] = File(None),
):
    try:
        areas_list = json.loads(damageAreas) if damageAreas else []
    except json.JSONDecodeError:
        areas_list = []

    damage_photo_data = await encode_upload(damagePhoto)
    insurance_card_data = await encode_upload(insuranceCard)

    obj = GlassRepair(
        firstName=firstName, lastName=lastName, email=email, phone=phone,
        year=year, make=make, model=model, trim=trim, bodyStyle=bodyStyle,
        damageAreas=areas_list, damageType=damageType, comments=comments,
        usingInsurance=usingInsurance, serviceLocation=serviceLocation,
        preferredDate=preferredDate, preferredTime=preferredTime,
        alternativeDate=alternativeDate, alternativeTime=alternativeTime,
        serviceAddress=serviceAddress, addressLine2=addressLine2,
        city=city, state=state, zip=zip,
        damagePhoto=damage_photo_data, insuranceCard=insurance_card_data,
    )
    await glass_repairs_collection.insert_one(obj.dict())
    data = obj.dict()
    for key in ('damagePhoto', 'insuranceCard'):
        if data.get(key):
            data[key] = {"filename": data[key].get("filename"), "contentType": data[key].get("contentType"), "size": data[key].get("size")}
    background_tasks.add_task(notify_admin, "Glass Repair Request", data)
    background_tasks.add_task(notify_customer, "Glass Repair Request", data)
    return obj


@api_router.get("/glass-repairs")
async def get_glass_repairs():
    items = await glass_repairs_collection.find({}, {"_id": 0}).to_list(1000)
    for item in items:
        for key in ('damagePhoto', 'insuranceCard'):
            if item.get(key):
                item[key] = {"filename": item[key].get("filename"), "contentType": item[key].get("contentType"), "size": item[key].get("size")}
    return items


# ==================== SERVICE / PARTS / BODY SHOP ====================
@api_router.post("/service-requests", response_model=SimpleContactRequest)
async def create_service_request(payload: SimpleContactRequestCreate, background_tasks: BackgroundTasks):
    obj = SimpleContactRequest(**payload.dict(), requestType='service')
    await service_requests_collection.insert_one(obj.dict())
    data = obj.dict()
    background_tasks.add_task(notify_admin, "Service Request", data)
    background_tasks.add_task(notify_customer, "Service Request", data)
    return obj


@api_router.post("/parts-requests", response_model=SimpleContactRequest)
async def create_parts_request(payload: SimpleContactRequestCreate, background_tasks: BackgroundTasks):
    obj = SimpleContactRequest(**payload.dict(), requestType='parts')
    await service_requests_collection.insert_one(obj.dict())
    data = obj.dict()
    background_tasks.add_task(notify_admin, "Parts Request", data)
    background_tasks.add_task(notify_customer, "Parts Request", data)
    return obj


@api_router.post("/body-shop-requests", response_model=SimpleContactRequest)
async def create_body_shop_request(payload: SimpleContactRequestCreate, background_tasks: BackgroundTasks):
    obj = SimpleContactRequest(**payload.dict(), requestType='body')
    await service_requests_collection.insert_one(obj.dict())
    data = obj.dict()
    background_tasks.add_task(notify_admin, "Body Shop Request", data)
    background_tasks.add_task(notify_customer, "Body Shop Request", data)
    return obj


@api_router.get("/service-requests")
async def get_service_requests(requestType: Optional[str] = None):
    query = {}
    if requestType:
        query['requestType'] = requestType
    items = await service_requests_collection.find(query, {"_id": 0}).to_list(1000)
    return items


# ==================== WARRANTY APPOINTMENT ====================
@api_router.post("/warranty-appointments", response_model=WarrantyAppointment)
async def create_warranty_appointment(payload: WarrantyAppointmentCreate, background_tasks: BackgroundTasks):
    obj = WarrantyAppointment(**payload.dict())
    await warranty_appointments_collection.insert_one(obj.dict())
    data = obj.dict()
    background_tasks.add_task(notify_admin, "Warranty Appointment", data)
    background_tasks.add_task(notify_customer, "Warranty Appointment", data)
    return obj


@api_router.get("/warranty-appointments", response_model=List[WarrantyAppointment])
async def get_warranty_appointments():
    items = await warranty_appointments_collection.find({}, {"_id": 0}).to_list(1000)
    return [WarrantyAppointment(**i) for i in items]


# ==================== WARRANTY INFO ====================
@api_router.post("/warranty-info", response_model=WarrantyInfoRequest)
async def create_warranty_info(payload: WarrantyInfoCreate, background_tasks: BackgroundTasks):
    obj = WarrantyInfoRequest(**payload.dict())
    await warranty_info_collection.insert_one(obj.dict())
    data = obj.dict()
    background_tasks.add_task(notify_admin, "Warranty Info Request", data)
    background_tasks.add_task(notify_customer, "Warranty Info Request", data)
    return obj


@api_router.get("/warranty-info", response_model=List[WarrantyInfoRequest])
async def get_warranty_info():
    items = await warranty_info_collection.find({}, {"_id": 0}).to_list(1000)
    return [WarrantyInfoRequest(**i) for i in items]


# ==================== SCHEDULE VISIT ====================
@api_router.post("/schedule-visits", response_model=ScheduleVisit)
async def create_schedule_visit(payload: ScheduleVisitCreate, background_tasks: BackgroundTasks):
    obj = ScheduleVisit(**payload.dict())
    await schedule_visits_collection.insert_one(obj.dict())
    data = obj.dict()
    background_tasks.add_task(notify_admin, "Visit Request", data)
    background_tasks.add_task(notify_customer, "Visit Request", data)
    return obj


@api_router.get("/schedule-visits", response_model=List[ScheduleVisit])
async def get_schedule_visits():
    items = await schedule_visits_collection.find({}, {"_id": 0}).to_list(1000)
    return [ScheduleVisit(**i) for i in items]


# ==================== REFERRAL ====================
@api_router.post("/referrals", response_model=Referral)
async def create_referral(payload: ReferralCreate, background_tasks: BackgroundTasks):
    obj = Referral(**payload.dict())
    await referrals_collection.insert_one(obj.dict())
    data = obj.dict()
    background_tasks.add_task(notify_admin, "Referral", data)
    background_tasks.add_task(notify_customer, "Referral", data)
    return obj


@api_router.get("/referrals", response_model=List[Referral])
async def get_referrals():
    items = await referrals_collection.find({}, {"_id": 0}).to_list(1000)
    return [Referral(**i) for i in items]


# ==================== PURCHASE REQUEST (multipart - Start Your Vehicle Purchase) ====================
@api_router.post("/purchase-requests", response_model=PurchaseRequest)
async def create_purchase_request(
    background_tasks: BackgroundTasks,
    firstName: str = Form(...),
    lastName: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    address: str = Form(''),
    addressLine2: str = Form(''),
    city: str = Form(''),
    state: str = Form(''),
    zip: str = Form(''),
    driversLicense: str = Form(''),
    purchaseVin: str = Form(''),
    purchaseYear: str = Form(''),
    purchaseMake: str = Form(''),
    purchaseModel: str = Form(''),
    purchaseTrim: str = Form(''),
    vehicleDescription: str = Form(''),
    purchaseMethod: str = Form(''),
    downPayment: str = Form(''),
    hasTrade: str = Form(''),
    tradeVin: str = Form(''),
    tradeYear: str = Form(''),
    tradeMake: str = Form(''),
    tradeModel: str = Form(''),
    tradeBodyStyle: str = Form(''),
    tradeTrim: str = Form(''),
    deliveryMethod: str = Form(''),
    preferredDate: str = Form(''),
    preferredTime: str = Form(''),
    deliveryLocation: str = Form(''),
    deliveryAddress: str = Form(''),
    deliveryAddressLine2: str = Form(''),
    deliveryCity: str = Form(''),
    deliveryState: str = Form(''),
    deliveryZip: str = Form(''),
    warranties: str = Form('[]'),
    comments: str = Form(''),
    dlFile: Optional[UploadFile] = File(None),
):
    try:
        warranties_list = json.loads(warranties) if warranties else []
    except json.JSONDecodeError:
        warranties_list = []

    dl_data = await encode_upload(dlFile)

    obj = PurchaseRequest(
        firstName=firstName, lastName=lastName, email=email, phone=phone,
        address=address, addressLine2=addressLine2, city=city, state=state, zip=zip,
        driversLicense=driversLicense, dlFile=dl_data,
        purchaseVin=purchaseVin, purchaseYear=purchaseYear, purchaseMake=purchaseMake,
        purchaseModel=purchaseModel, purchaseTrim=purchaseTrim,
        vehicleDescription=vehicleDescription,
        purchaseMethod=purchaseMethod, downPayment=downPayment, hasTrade=hasTrade,
        tradeVin=tradeVin, tradeYear=tradeYear, tradeMake=tradeMake,
        tradeModel=tradeModel, tradeBodyStyle=tradeBodyStyle, tradeTrim=tradeTrim,
        deliveryMethod=deliveryMethod, preferredDate=preferredDate, preferredTime=preferredTime,
        deliveryLocation=deliveryLocation, deliveryAddress=deliveryAddress,
        deliveryAddressLine2=deliveryAddressLine2, deliveryCity=deliveryCity,
        deliveryState=deliveryState, deliveryZip=deliveryZip,
        warranties=warranties_list, comments=comments,
    )
    await purchase_requests_collection.insert_one(obj.dict())
    data = obj.dict()
    if data.get('dlFile'):
        data['dlFile'] = {"filename": data['dlFile'].get("filename"), "contentType": data['dlFile'].get("contentType"), "size": data['dlFile'].get("size")}
    background_tasks.add_task(notify_admin, "Purchase Request", data)
    background_tasks.add_task(notify_customer, "Purchase Request", data)
    return obj


@api_router.get("/purchase-requests")
async def get_purchase_requests():
    items = await purchase_requests_collection.find({}, {"_id": 0}).to_list(1000)
    for item in items:
        if item.get('dlFile'):
            item['dlFile'] = {"filename": item['dlFile'].get("filename"), "contentType": item['dlFile'].get("contentType"), "size": item['dlFile'].get("size")}
    return items


# ==================== CAR FINDER REQUEST ====================
@api_router.post("/car-finder-requests", response_model=CarFinderRequest)
async def create_car_finder_request(payload: CarFinderRequestCreate, background_tasks: BackgroundTasks):
    obj = CarFinderRequest(**payload.dict())
    await car_finder_requests_collection.insert_one(obj.dict())
    data = obj.dict()
    background_tasks.add_task(notify_admin, "Car Finder Request", data)
    background_tasks.add_task(notify_customer, "Car Finder Request", data)
    return obj


@api_router.get("/car-finder-requests", response_model=List[CarFinderRequest])
async def get_car_finder_requests():
    items = await car_finder_requests_collection.find({}, {"_id": 0}).to_list(1000)
    return [CarFinderRequest(**i) for i in items]


# ==================== STATS ====================
@api_router.get("/stats")
async def get_stats():
    return {
        "totalVehicles": await vehicles_collection.count_documents({}),
        "totalContacts": await contacts_collection.count_documents({}),
        "totalFinanceApplications": await finance_applications_collection.count_documents({}),
        "totalTradeIns": await trade_ins_collection.count_documents({}),
        "totalGlassRepairs": await glass_repairs_collection.count_documents({}),
        "totalServiceRequests": await service_requests_collection.count_documents({}),
        "totalWarrantyAppointments": await warranty_appointments_collection.count_documents({}),
        "totalWarrantyInfoRequests": await warranty_info_collection.count_documents({}),
        "totalScheduleVisits": await schedule_visits_collection.count_documents({}),
        "totalReferrals": await referrals_collection.count_documents({}),
        "totalPurchaseRequests": await purchase_requests_collection.count_documents({}),
        "totalCarFinderRequests": await car_finder_requests_collection.count_documents({}),
    }


# Mount admin submissions router (nested under /api, protected by auth)
admin_submissions_router = build_admin_router({
    "contacts": contacts_collection,
    "finance_applications": finance_applications_collection,
    "trade_ins": trade_ins_collection,
    "glass_repairs": glass_repairs_collection,
    "service_requests": service_requests_collection,
    "warranty_appointments": warranty_appointments_collection,
    "warranty_info_requests": warranty_info_collection,
    "schedule_visits": schedule_visits_collection,
    "referrals": referrals_collection,
    "purchase_requests": purchase_requests_collection,
    "car_finder_requests": car_finder_requests_collection,
}, auth_dependency=get_current_user)
api_router.include_router(admin_submissions_router)


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_db_client():
    try:
        await users_collection.create_index("email", unique=True)
    except Exception as exc:
        logger.warning("users.email index create warning: %s", exc)
    await seed_admin(users_collection)
    logger.info("Startup complete: admin seeded, indexes ensured")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
