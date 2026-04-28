"""Tests for new Purchase Requests + Car Finder Requests endpoints (iteration_3)."""
import os
import io
import json
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://vehicle-xen.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@xenmotors.com"
ADMIN_PASSWORD = "XenAdmin@2026"


@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# -------- Purchase Requests (multipart) --------

def _unique_email(prefix):
    return f"TEST_{prefix}_{uuid.uuid4().hex[:8]}@example.com"


def test_purchase_request_full_multipart_with_file():
    email = _unique_email("purchase_full")
    warranties = ["Extended Warranty", "Tire & Wheel", "GAP Insurance"]
    form = {
        "firstName": "TEST_Sam",
        "lastName": "Purchase",
        "email": email,
        "phone": "(555) 123-4567",
        "address": "123 Main",
        "city": "Austin",
        "state": "TX",
        "zip": "78701",
        "driversLicense": "DL999",
        "purchaseVin": "1HGBH41JXMN109186",
        "purchaseYear": "2022",
        "purchaseMake": "Honda",
        "purchaseModel": "Civic",
        "purchaseTrim": "EX",
        "vehicleDescription": "Blue sedan",
        "purchaseMethod": "Financing",
        "downPayment": "5000",
        "hasTrade": "Yes",
        "tradeVin": "V2",
        "tradeYear": "2018",
        "tradeMake": "Toyota",
        "tradeModel": "Camry",
        "tradeBodyStyle": "Sedan",
        "tradeTrim": "LE",
        "deliveryMethod": "Home Delivery",
        "preferredDate": "2026-02-15",
        "preferredTime": "10 AM",
        "deliveryAddress": "456 Oak",
        "deliveryCity": "Austin",
        "deliveryState": "TX",
        "deliveryZip": "78702",
        "warranties": json.dumps(warranties),
        "comments": "Please include service package",
    }
    files = {"dlFile": ("dl.png", io.BytesIO(b"\x89PNG\r\n\x1a\nFAKEDLIMAGE"), "image/png")}
    r = requests.post(f"{API}/purchase-requests", data=form, files=files, timeout=30)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["email"] == email
    assert body["warranties"] == warranties
    assert body["hasTrade"] == "Yes"
    assert body["dlFile"] is not None
    assert body["dlFile"]["filename"] == "dl.png"
    assert body["dlFile"]["size"] > 0
    assert "base64" in body["dlFile"]
    return body["id"]


def test_purchase_request_minimum_required():
    email = _unique_email("purchase_min")
    form = {
        "firstName": "TEST_Min",
        "lastName": "User",
        "email": email,
        "phone": "(555) 000-0000",
    }
    r = requests.post(f"{API}/purchase-requests", data=form, timeout=20)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["email"] == email
    assert body["warranties"] == []
    assert body["dlFile"] is None


def test_purchase_request_missing_required_fails():
    r = requests.post(f"{API}/purchase-requests", data={"firstName": "OnlyFirst"}, timeout=15)
    assert r.status_code == 422


def test_purchase_requests_list_strips_base64():
    # Ensure at least one record exists with dlFile
    email = _unique_email("purchase_list")
    form = {"firstName": "TEST_List", "lastName": "X", "email": email, "phone": "5551112222"}
    files = {"dlFile": ("t.png", io.BytesIO(b"ABCDEF12345"), "image/png")}
    requests.post(f"{API}/purchase-requests", data=form, files=files, timeout=20)

    r = requests.get(f"{API}/purchase-requests", timeout=15)
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    # Find our record
    ours = [i for i in items if i.get("email") == email]
    assert ours, "created purchase request not found in list"
    rec = ours[0]
    assert rec.get("dlFile") is not None
    assert "base64" not in rec["dlFile"], "base64 should be stripped from list view"
    assert rec["dlFile"].get("filename") == "t.png"


# -------- Car Finder Requests (JSON) --------

def test_car_finder_request_full_payload():
    email = _unique_email("carfinder_full")
    payload = {
        "firstName": "TEST_Jane",
        "lastName": "CarFinder",
        "email": email,
        "phone": "5559998888",
        "zip": "90210",
        "condition": "New",
        "bodyStyle": "SUV",
        "make": "Toyota",
        "model": "RAV4",
        "trim": "XLE",
        "transmission": "Automatic",
        "minMpg": "25",
        "maxMileage": "50000",
        "yearMin": "2020",
        "yearMax": "2025",
        "exteriorColor": "Blue",
        "interiorColor": "Black",
        "minPrice": "20000",
        "maxPrice": "40000",
        "maxMonthlyPayment": "500",
        "engine": "V6",
        "drivetrain": "AWD",
        "fuelType": "Gasoline",
        "seats": "5",
        "seatingRows": "2",
        "doors": "4",
        "interiorFeatures": ["Leather Seats", "Heated Seats", "Sunroof"],
        "exteriorFeatures": ["Alloy Wheels", "Tow Hitch"],
        "infotainmentFeatures": ["Bluetooth", "Apple CarPlay", "Android Auto"],
        "safetyFeatures": ["Lane Departure", "Blind Spot Monitor", "Adaptive Cruise"],
        "comments": "Looking for family SUV",
        "purchaseTimeline": "1-3 months",
    }
    r = requests.post(f"{API}/car-finder-requests", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["email"] == email
    assert body["interiorFeatures"] == payload["interiorFeatures"]
    assert body["safetyFeatures"] == payload["safetyFeatures"]
    assert body["zip"] == "90210"
    assert "id" in body


def test_car_finder_request_minimum_required():
    email = _unique_email("carfinder_min")
    payload = {
        "firstName": "TEST_Mn",
        "lastName": "Z",
        "email": email,
        "phone": "5550001111",
        "zip": "10001",
    }
    r = requests.post(f"{API}/car-finder-requests", json=payload, timeout=15)
    assert r.status_code == 200
    assert r.json()["email"] == email


def test_car_finder_request_missing_required_fails():
    r = requests.post(f"{API}/car-finder-requests", json={"firstName": "X"}, timeout=15)
    assert r.status_code == 422


def test_car_finder_list_returns_records():
    # create one
    email = _unique_email("carfinder_list")
    payload = {"firstName": "TEST_L", "lastName": "L", "email": email, "phone": "5552223333", "zip": "30301"}
    requests.post(f"{API}/car-finder-requests", json=payload, timeout=15)
    r = requests.get(f"{API}/car-finder-requests", timeout=15)
    assert r.status_code == 200
    items = r.json()
    assert any(i.get("email") == email for i in items)


# -------- Stats --------

def test_stats_includes_new_counters():
    r = requests.get(f"{API}/stats", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert "totalPurchaseRequests" in data
    assert "totalCarFinderRequests" in data
    assert isinstance(data["totalPurchaseRequests"], int)
    assert isinstance(data["totalCarFinderRequests"], int)


# -------- Admin endpoints --------

def test_admin_purchase_requests_list_strips_base64(auth_headers):
    # seed
    email = _unique_email("admin_pr")
    form = {"firstName": "TEST_Adm", "lastName": "PR", "email": email, "phone": "5551010101"}
    files = {"dlFile": ("x.png", io.BytesIO(b"HELLOBASE64"), "image/png")}
    r_create = requests.post(f"{API}/purchase-requests", data=form, files=files, timeout=20)
    assert r_create.status_code == 200
    created_id = r_create.json()["id"]

    r = requests.get(f"{API}/admin/submissions/purchase_requests", headers=auth_headers, timeout=15)
    assert r.status_code == 200, r.text
    items = r.json()
    ours = [i for i in items if i.get("id") == created_id]
    assert ours
    assert ours[0].get("dlFile") is not None
    assert "base64" not in ours[0]["dlFile"]

    # detail endpoint returns base64
    r2 = requests.get(f"{API}/admin/submissions/purchase_requests/{created_id}", headers=auth_headers, timeout=15)
    assert r2.status_code == 200
    detail = r2.json()
    assert detail["dlFile"] is not None
    assert "base64" in detail["dlFile"]
    assert len(detail["dlFile"]["base64"]) > 0


def test_admin_car_finder_list_and_detail(auth_headers):
    email = _unique_email("admin_cf")
    payload = {"firstName": "TEST_Admcf", "lastName": "CF", "email": email, "phone": "5554445555", "zip": "11111",
               "safetyFeatures": ["ABS"]}
    r_create = requests.post(f"{API}/car-finder-requests", json=payload, timeout=15)
    assert r_create.status_code == 200
    created_id = r_create.json()["id"]

    r = requests.get(f"{API}/admin/submissions/car_finder_requests", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    items = r.json()
    assert any(i.get("id") == created_id for i in items)

    r2 = requests.get(f"{API}/admin/submissions/car_finder_requests/{created_id}", headers=auth_headers, timeout=15)
    assert r2.status_code == 200
    assert r2.json()["id"] == created_id


def test_admin_patch_purchase_request_read(auth_headers):
    email = _unique_email("admin_patch")
    form = {"firstName": "TEST_Patch", "lastName": "U", "email": email, "phone": "5558887777"}
    created = requests.post(f"{API}/purchase-requests", data=form, timeout=15).json()
    rid = created["id"]
    r = requests.patch(f"{API}/admin/submissions/purchase_requests/{rid}", headers=auth_headers,
                       json={"read": True}, timeout=15)
    assert r.status_code == 200
    assert r.json()["read"] is True
    # verify persistence
    r2 = requests.get(f"{API}/admin/submissions/purchase_requests/{rid}", headers=auth_headers, timeout=15)
    assert r2.json()["read"] is True


def test_admin_counts_new_kinds(auth_headers):
    for kind in ("purchase_requests", "car_finder_requests"):
        r = requests.get(f"{API}/admin/submissions/{kind}/counts", headers=auth_headers, timeout=15)
        assert r.status_code == 200, f"{kind}: {r.text}"
        body = r.json()
        assert body["kind"] == kind
        assert "total" in body and "unread" in body


def test_admin_requires_auth():
    r = requests.get(f"{API}/admin/submissions/purchase_requests", timeout=10)
    assert r.status_code in (401, 403)
    r2 = requests.get(f"{API}/admin/submissions/car_finder_requests", timeout=10)
    assert r2.status_code in (401, 403)


# -------- Regression on existing endpoints --------

def test_existing_health_and_vehicles():
    r = requests.get(f"{API}/health", timeout=10)
    assert r.status_code == 200
    r2 = requests.get(f"{API}/vehicles", timeout=15)
    assert r2.status_code == 200
    assert isinstance(r2.json(), list)


def test_existing_contact_post_still_public():
    r = requests.post(f"{API}/contacts", json={
        "name": "TEST_Reg", "email": _unique_email("contact"), "message": "regression"
    }, timeout=15)
    assert r.status_code == 200
