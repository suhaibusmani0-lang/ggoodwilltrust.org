"""Backend API tests for Xen Motors dealership clone.

Covers: health, stats, vehicles, contacts, finance applications,
trade-ins (multipart), glass repairs (multipart), service/parts/body,
warranty appointments + info, schedule visits, referrals.
"""
import io
import json
import os

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://vehicle-xen.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    return s


# ---------- Health & Stats ----------
def test_health(client):
    r = client.get(f"{API}/health", timeout=20)
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_stats(client):
    r = client.get(f"{API}/stats", timeout=20)
    assert r.status_code == 200
    data = r.json()
    for k in [
        "totalVehicles", "totalContacts", "totalFinanceApplications",
        "totalTradeIns", "totalGlassRepairs", "totalServiceRequests",
        "totalWarrantyAppointments", "totalWarrantyInfoRequests",
        "totalScheduleVisits", "totalReferrals",
    ]:
        assert k in data, f"missing {k}"
        assert isinstance(data[k], int)


# ---------- Vehicles (seeded) ----------
def test_get_vehicles_seeded(client):
    r = client.get(f"{API}/vehicles", timeout=20)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    # Note: not asserting >0 because seed may or may not be present.


# ---------- Contact ----------
def test_create_contact_and_list(client):
    payload = {
        "name": "TEST_John Tester",
        "email": "test_john@example.com",
        "phone": "555-1234",
        "message": "Hello from pytest",
    }
    r = client.post(f"{API}/contacts", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["name"] == payload["name"]
    assert body["email"] == payload["email"]
    assert "id" in body and body["id"]
    # GET verifies persistence
    r2 = client.get(f"{API}/contacts", timeout=20)
    assert r2.status_code == 200
    ids = [c["id"] for c in r2.json()]
    assert body["id"] in ids


# ---------- Finance application ----------
def test_create_finance_application(client):
    payload = {
        "firstName": "TEST_Jane",
        "lastName": "Doe",
        "email": "test_jane@example.com",
        "phone": "555-9999",
        "address": "123 Main St",
        "city": "Hicksville",
        "state": "NY",
        "zip": "11801",
        "agreedToTerms": True,
        "desiredAmount": "20000",
        "loanTerm": "60",
    }
    r = client.post(f"{API}/finance-applications", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["firstName"] == "TEST_Jane"
    assert body["agreedToTerms"] is True
    fid = body["id"]
    r2 = client.get(f"{API}/finance-applications", timeout=20)
    assert r2.status_code == 200
    assert fid in [x["id"] for x in r2.json()]


# ---------- Trade-in (multipart) ----------
def _png_bytes():
    # 1x1 png
    return (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00"
        b"\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc"
        b"\xf8\xcf\xc0\x00\x00\x00\x03\x00\x01\x5b\xd1\x21\xa3\x00\x00\x00\x00IEND\xaeB`\x82"
    )


def test_create_trade_in_multipart(client):
    issues = ["check_engine_light", "brakes"]
    data = {
        "firstName": "TEST_Trade",
        "lastName": "User",
        "email": "test_trade@example.com",
        "phone": "555-7777",
        "year": "2020",
        "make": "Toyota",
        "model": "Camry",
        "mileage": "45000",
        "vin": "1HGBH41JXMN109186",
        "mechanicalIssues": json.dumps(issues),
        "overallCondition": "Good",
        "askingPrice": "15000",
    }
    files = {
        "photoExteriorFront": ("front.png", io.BytesIO(_png_bytes()), "image/png"),
        "photoInteriorFront": ("int.png", io.BytesIO(_png_bytes()), "image/png"),
    }
    r = client.post(f"{API}/trade-ins", data=data, files=files, timeout=30)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["firstName"] == "TEST_Trade"
    assert body["mechanicalIssues"] == issues
    assert "exteriorFront" in body["photos"]
    assert body["photos"]["exteriorFront"]["filename"] == "front.png"
    # base64 should be in POST response
    assert "base64" in body["photos"]["exteriorFront"]

    # GET should strip base64
    r2 = client.get(f"{API}/trade-ins", timeout=30)
    assert r2.status_code == 200
    found = [t for t in r2.json() if t["id"] == body["id"]]
    assert found, "Trade-in not found in list"
    photo = found[0]["photos"]["exteriorFront"]
    assert "base64" not in photo
    assert photo["filename"] == "front.png"
    assert photo["size"] > 0


# ---------- Glass repair (multipart) ----------
def test_create_glass_repair_multipart(client):
    areas = ["windshield", "driver_window"]
    data = {
        "firstName": "TEST_Glass",
        "lastName": "Repair",
        "email": "test_glass@example.com",
        "phone": "555-3333",
        "year": "2019",
        "make": "Honda",
        "model": "Civic",
        "damageAreas": json.dumps(areas),
        "damageType": "crack",
        "usingInsurance": "yes",
    }
    files = {
        "damagePhoto": ("dmg.png", io.BytesIO(_png_bytes()), "image/png"),
        "insuranceCard": ("ins.png", io.BytesIO(_png_bytes()), "image/png"),
    }
    r = client.post(f"{API}/glass-repairs", data=data, files=files, timeout=30)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["damageAreas"] == areas
    assert body["damagePhoto"]["filename"] == "dmg.png"
    gid = body["id"]
    r2 = client.get(f"{API}/glass-repairs", timeout=30)
    assert r2.status_code == 200
    found = [t for t in r2.json() if t["id"] == gid]
    assert found
    assert "base64" not in found[0]["damagePhoto"]
    assert found[0]["damagePhoto"]["size"] > 0


# ---------- Service / Parts / Body ----------
@pytest.mark.parametrize("endpoint,expected_type", [
    ("service-requests", "service"),
    ("parts-requests", "parts"),
    ("body-shop-requests", "body"),
])
def test_simple_contact_requests(client, endpoint, expected_type):
    payload = {
        "firstName": f"TEST_{expected_type}",
        "lastName": "User",
        "email": f"test_{expected_type}@example.com",
        "phone": "555-0000",
        "preferredContact": "Email",
        "comments": "Pytest test",
    }
    r = client.post(f"{API}/{endpoint}", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["requestType"] == expected_type
    assert body["firstName"] == payload["firstName"]
    # GET filtered
    r2 = client.get(f"{API}/service-requests", params={"requestType": expected_type}, timeout=20)
    assert r2.status_code == 200
    types = {x["requestType"] for x in r2.json()}
    assert expected_type in types


# ---------- Warranty appointment + info ----------
def test_warranty_appointment(client):
    payload = {
        "firstName": "TEST_War",
        "lastName": "Apt",
        "email": "test_warapt@example.com",
        "phone": "555-1212",
        "vehicleYear": "2021",
        "vehicleMake": "Ford",
        "vehicleModel": "F-150",
        "appointmentInfo": ["oil_change", "tire_rotation"],
        "preferredDate": "2026-02-01",
    }
    r = client.post(f"{API}/warranty-appointments", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["appointmentInfo"] == ["oil_change", "tire_rotation"]
    aid = body["id"]
    r2 = client.get(f"{API}/warranty-appointments", timeout=20)
    assert r2.status_code == 200
    assert aid in [x["id"] for x in r2.json()]


def test_warranty_info(client):
    payload = {
        "name": "TEST_WInfo",
        "email": "test_winfo@example.com",
        "phone": "555-1111",
        "vehicleInfo": "2020 Toyota Camry",
        "message": "Need warranty info",
    }
    r = client.post(f"{API}/warranty-info", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["name"] == "TEST_WInfo"


# ---------- Schedule visit ----------
def test_schedule_visit(client):
    payload = {
        "firstName": "TEST_Visit",
        "lastName": "User",
        "email": "test_visit@example.com",
        "phone": "555-2222",
        "department": "Sales",
        "preferredDate": "2026-02-15",
    }
    r = client.post(f"{API}/schedule-visits", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    assert r.json()["firstName"] == "TEST_Visit"


# ---------- Referral ----------
def test_referral(client):
    payload = {
        "referralFirstName": "TEST_RefF",
        "referralLastName": "RefL",
        "phone": "555-4444",
        "email": "test_refee@example.com",
        "yourFirstName": "TEST_You",
        "yourLastName": "Yours",
        "yourPhone": "555-5555",
        "yourEmail": "test_yours@example.com",
    }
    r = client.post(f"{API}/referrals", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["referralFirstName"] == "TEST_RefF"


# ---------- ObjectId leak check ----------
def test_no_objectid_leak(client):
    """Ensure GET endpoints don't return raw _id field."""
    for path in [
        "/vehicles", "/contacts", "/finance-applications",
        "/trade-ins", "/glass-repairs", "/service-requests",
        "/warranty-appointments", "/warranty-info",
        "/schedule-visits", "/referrals",
    ]:
        r = client.get(f"{API}{path}", timeout=20)
        assert r.status_code == 200, f"{path} -> {r.status_code}"
        for item in r.json():
            assert "_id" not in item, f"_id leaked in {path}"
