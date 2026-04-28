from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid


class Vehicle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    year: int
    make: str
    model: str
    trim: str
    price: float
    mileage: int
    image: str = ''  # primary/legacy URL (kept for backwards compatibility)
    images: List[str] = []  # list of image URLs or data: URIs (base64)
    engine: str = ''
    transmission: str = ''
    drivetrain: str = ''
    exteriorColor: str = ''
    interiorColor: str = ''
    bodyType: str = ''
    vin: str = ''
    stockNumber: str = ''
    fuelType: str = ''
    mpgCity: Optional[int] = None
    mpgHwy: Optional[int] = None
    condition: str = 'Used'
    description: str = ''
    features: List[str] = []
    seatingRows: Optional[int] = None
    maxSeating: Optional[int] = None
    vehicleType: str = ''  # Sedan / SUV / etc (alias of bodyType)
    size: str = ''  # compact / midsize etc
    featured: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)


class VehicleCreate(BaseModel):
    year: int
    make: str
    model: str
    trim: str = ''
    price: float
    mileage: int
    image: str = ''
    images: List[str] = []
    engine: str = ''
    transmission: str = ''
    drivetrain: str = ''
    exteriorColor: str = ''
    interiorColor: str = ''
    bodyType: str = ''
    vin: str = ''
    stockNumber: str = ''
    fuelType: str = ''
    mpgCity: Optional[int] = None
    mpgHwy: Optional[int] = None
    condition: str = 'Used'
    description: str = ''
    features: List[str] = []
    seatingRows: Optional[int] = None
    maxSeating: Optional[int] = None
    vehicleType: str = ''
    size: str = ''
    featured: bool = False


class VehicleUpdate(BaseModel):
    year: Optional[int] = None
    make: Optional[str] = None
    model: Optional[str] = None
    trim: Optional[str] = None
    price: Optional[float] = None
    mileage: Optional[int] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    engine: Optional[str] = None
    transmission: Optional[str] = None
    drivetrain: Optional[str] = None
    exteriorColor: Optional[str] = None
    interiorColor: Optional[str] = None
    bodyType: Optional[str] = None
    vin: Optional[str] = None
    stockNumber: Optional[str] = None
    fuelType: Optional[str] = None
    mpgCity: Optional[int] = None
    mpgHwy: Optional[int] = None
    condition: Optional[str] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    seatingRows: Optional[int] = None
    maxSeating: Optional[int] = None
    vehicleType: Optional[str] = None
    size: Optional[str] = None
    featured: Optional[bool] = None


class Contact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    vehicleId: Optional[str] = None
    read: bool = False
    archived: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)


class ContactCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    vehicleId: Optional[str] = None


# ==================== FINANCE APPLICATION ====================
class FinanceApplicationCreate(BaseModel):
    vehicleId: Optional[str] = ''
    firstName: str
    middleInitial: Optional[str] = ''
    lastName: str
    phone: str
    phoneType: Optional[str] = 'Cell'
    email: str
    ssn: Optional[str] = ''
    birthdate: Optional[str] = ''
    dlNumber: Optional[str] = ''
    dlIssueDate: Optional[str] = ''
    dlExpirationDate: Optional[str] = ''
    dlState: Optional[str] = ''
    dlCounty: Optional[str] = ''
    residenceType: Optional[str] = ''
    monthlyRent: Optional[str] = ''
    yearsAtResidence: Optional[str] = ''
    monthsAtResidence: Optional[str] = ''
    address: str
    address2: Optional[str] = ''
    city: str
    state: str
    zip: str
    employmentStatus: Optional[str] = ''
    income: Optional[str] = ''
    incomeInterval: Optional[str] = 'Monthly'
    employer: Optional[str] = ''
    jobTitle: Optional[str] = ''
    employerPhone: Optional[str] = ''
    yearsAtJob: Optional[str] = ''
    monthsAtJob: Optional[str] = ''
    otherMonthlyIncome: Optional[str] = ''
    desiredAmount: Optional[str] = ''
    loanTerm: Optional[str] = ''
    desiredPayment: Optional[str] = ''
    downPayment: Optional[str] = ''
    agreedToTerms: bool = False


class FinanceApplication(FinanceApplicationCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    read: bool = False
    archived: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)


# ==================== TRADE-IN ====================
class TradeIn(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    firstName: str
    lastName: str
    email: str
    phone: str
    year: Optional[str] = ''
    make: Optional[str] = ''
    model: Optional[str] = ''
    trim: Optional[str] = ''
    bodyStyle: Optional[str] = ''
    mileage: Optional[str] = ''
    vin: Optional[str] = ''
    exteriorColor: Optional[str] = ''
    interiorColor: Optional[str] = ''
    transmission: Optional[str] = ''
    drivetrain: Optional[str] = ''
    titleStatus: Optional[str] = ''
    lienHolder: Optional[str] = ''
    payoffAmount: Optional[str] = ''
    overallCondition: Optional[str] = ''
    accidentHistory: Optional[str] = ''
    mechanicalIssues: List[str] = []
    modifications: Optional[str] = ''
    askingPrice: Optional[str] = ''
    comments: Optional[str] = ''
    photos: dict = {}  # {slot: {filename, contentType, base64}}
    read: bool = False
    archived: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)


# ==================== GLASS REPAIR ====================
class GlassRepairCreate(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str
    year: Optional[str] = ''
    make: Optional[str] = ''
    model: Optional[str] = ''
    trim: Optional[str] = ''
    bodyStyle: Optional[str] = ''
    damageAreas: List[str] = []
    damageType: Optional[str] = ''
    comments: Optional[str] = ''
    usingInsurance: Optional[str] = ''
    serviceLocation: Optional[str] = ''
    preferredDate: Optional[str] = ''
    preferredTime: Optional[str] = ''
    alternativeDate: Optional[str] = ''
    alternativeTime: Optional[str] = ''
    serviceAddress: Optional[str] = ''
    addressLine2: Optional[str] = ''
    city: Optional[str] = ''
    state: Optional[str] = ''
    zip: Optional[str] = ''


class GlassRepair(GlassRepairCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    damagePhoto: Optional[dict] = None
    insuranceCard: Optional[dict] = None
    read: bool = False
    archived: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)


# ==================== SERVICE / PARTS / BODY SHOP ====================
class SimpleContactRequestCreate(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str
    preferredContact: Optional[str] = 'Phone'
    comments: Optional[str] = ''


class SimpleContactRequest(SimpleContactRequestCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    requestType: str  # service / parts / body
    read: bool = False
    archived: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)


# ==================== WARRANTY APPOINTMENT ====================
class WarrantyAppointmentCreate(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str
    vehicleYear: Optional[str] = ''
    vehicleMake: Optional[str] = ''
    vehicleModel: Optional[str] = ''
    licensePlate: Optional[str] = ''
    vin: Optional[str] = ''
    mileage: Optional[str] = ''
    appointmentInfo: List[str] = []
    preferredDate: Optional[str] = ''
    preferredTime: Optional[str] = ''
    alternateDate: Optional[str] = ''
    alternateTime: Optional[str] = ''
    pickupLocation: Optional[str] = ''
    address: Optional[str] = ''
    addressLine2: Optional[str] = ''
    city: Optional[str] = ''
    state: Optional[str] = ''
    zip: Optional[str] = ''


class WarrantyAppointment(WarrantyAppointmentCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    read: bool = False
    archived: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)


# ==================== WARRANTY INFO REQUEST ====================
class WarrantyInfoCreate(BaseModel):
    name: str
    email: str
    phone: str
    vehicleInfo: Optional[str] = ''
    message: Optional[str] = ''


class WarrantyInfoRequest(WarrantyInfoCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    read: bool = False
    archived: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)


# ==================== SCHEDULE VISIT ====================
class ScheduleVisitCreate(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str
    department: Optional[str] = ''
    teamMember: Optional[str] = ''
    helpMessage: Optional[str] = ''
    preferredDate: Optional[str] = ''
    preferredTime: Optional[str] = ''
    alternateDate: Optional[str] = ''
    alternateTime: Optional[str] = ''
    comments: Optional[str] = ''


class ScheduleVisit(ScheduleVisitCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    read: bool = False
    archived: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)


# ==================== REFERRAL ====================
class ReferralCreate(BaseModel):
    referralFirstName: str
    referralLastName: str
    phone: str
    email: str
    address: Optional[str] = ''
    addressLine2: Optional[str] = ''
    city: Optional[str] = ''
    state: Optional[str] = ''
    zip: Optional[str] = ''
    yourFirstName: str
    yourLastName: str
    yourPhone: str
    yourEmail: str


class Referral(ReferralCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    read: bool = False
    archived: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)


# ==================== PURCHASE REQUEST (multipart - Start Your Vehicle Purchase) ====================
class PurchaseRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    firstName: str
    lastName: str
    email: str
    phone: str
    address: Optional[str] = ''
    addressLine2: Optional[str] = ''
    city: Optional[str] = ''
    state: Optional[str] = ''
    zip: Optional[str] = ''
    driversLicense: Optional[str] = ''
    dlFile: Optional[dict] = None
    purchaseVin: Optional[str] = ''
    purchaseYear: Optional[str] = ''
    purchaseMake: Optional[str] = ''
    purchaseModel: Optional[str] = ''
    purchaseTrim: Optional[str] = ''
    vehicleDescription: Optional[str] = ''
    purchaseMethod: Optional[str] = ''
    downPayment: Optional[str] = ''
    hasTrade: Optional[str] = ''
    tradeVin: Optional[str] = ''
    tradeYear: Optional[str] = ''
    tradeMake: Optional[str] = ''
    tradeModel: Optional[str] = ''
    tradeBodyStyle: Optional[str] = ''
    tradeTrim: Optional[str] = ''
    deliveryMethod: Optional[str] = ''
    preferredDate: Optional[str] = ''
    preferredTime: Optional[str] = ''
    deliveryLocation: Optional[str] = ''
    deliveryAddress: Optional[str] = ''
    deliveryAddressLine2: Optional[str] = ''
    deliveryCity: Optional[str] = ''
    deliveryState: Optional[str] = ''
    deliveryZip: Optional[str] = ''
    warranties: List[str] = []
    comments: Optional[str] = ''
    read: bool = False
    archived: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)


# ==================== CAR FINDER REQUEST ====================
class CarFinderRequestCreate(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str
    zip: str
    condition: Optional[str] = ''
    bodyStyle: Optional[str] = ''
    make: Optional[str] = ''
    model: Optional[str] = ''
    trim: Optional[str] = ''
    transmission: Optional[str] = ''
    minMpg: Optional[str] = ''
    maxMileage: Optional[str] = ''
    yearMin: Optional[str] = ''
    yearMax: Optional[str] = ''
    exteriorColor: Optional[str] = ''
    interiorColor: Optional[str] = ''
    minPrice: Optional[str] = ''
    maxPrice: Optional[str] = ''
    maxMonthlyPayment: Optional[str] = ''
    engine: Optional[str] = ''
    drivetrain: Optional[str] = ''
    fuelType: Optional[str] = ''
    seats: Optional[str] = ''
    seatingRows: Optional[str] = ''
    doors: Optional[str] = ''
    interiorFeatures: List[str] = []
    exteriorFeatures: List[str] = []
    infotainmentFeatures: List[str] = []
    safetyFeatures: List[str] = []
    comments: Optional[str] = ''
    purchaseTimeline: Optional[str] = ''


class CarFinderRequest(CarFinderRequestCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    read: bool = False
    archived: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)
