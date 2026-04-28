"""Tests for extended Vehicle model + multipart upload endpoints (iteration 4).

Covers:
- POST /api/vehicles with new fields (auth required)
- PUT /api/vehicles/{id} updates new fields
- GET /api/vehicles returns new fields, backwards compatible
- POST /api/vehicles/upload multipart (auth required)
- PUT /api/vehicles/{id}/upload multipart (auth required)
- 5MB file size limit (413)
- Auth required for create/update/delete (401 without token)
"""
import io
import json
import os

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://vehicle-xen.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@xenmotors.com"
ADMIN_PASS = "XenAdmin@2026"


def _png_bytes():
    return (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00"
        b"\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc"
        b"\xf8\xcf\xc0\x00\x00\x00\x03\x00\x01\x5b\xd1\x21\xa3\x00\x00\x00\x00IEND\xaeB`\x82"
    )


@pytest.fixture(scope="module")
def client():
    return requests.Session()


@pytest.fixture(scope="module")
def token(client):
    r = client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASS}, timeout=20)
    if r.status_code != 200:
        pytest.skip(f"Auth failed: {r.status_code} {r.text}")
    return r.json()["access_token"]


@pytest.fixture(scope="module")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# Track created IDs for cleanup
CREATED_IDS = []


@pytest.fixture(scope="module", autouse=True)
def cleanup(client, auth_headers):
    yield
    for vid in CREATED_IDS:
        try:
            client.delete(f"{API}/vehicles/{vid}", headers=auth_headers, timeout=20)
        except Exception:
            pass


# ---------- Auth enforcement (use fresh session - no cookies) ----------
def test_create_vehicle_requires_auth():
    r = requests.post(f"{API}/vehicles", json={
        "year": 2023, "make": "TEST", "model": "X", "trim": "Base",
        "price": 25000, "mileage": 1000,
    }, timeout=20)
    assert r.status_code in (401, 403), f"Expected 401/403, got {r.status_code}"


def test_upload_create_requires_auth():
    payload = {"year": 2023, "make": "TEST", "model": "X", "price": 25000, "mileage": 1000}
    r = requests.post(f"{API}/vehicles/upload", data={"data": json.dumps(payload)}, timeout=20)
    assert r.status_code in (401, 403)


# ---------- Create with new fields (JSON) ----------
def test_create_vehicle_with_new_fields(client, auth_headers):
    payload = {
        "year": 2024,
        "make": "TEST_Make",
        "model": "ModelX",
        "trim": "Premium",
        "price": 45000.0,
        "mileage": 12000,
        "image": "https://example.com/a.jpg",
        "images": ["https://example.com/a.jpg", "https://example.com/b.jpg"],
        "engine": "V6",
        "transmission": "Automatic",
        "drivetrain": "AWD",
        "exteriorColor": "Black",
        "interiorColor": "Tan",
        "bodyType": "SUV",
        "vin": "1HGBH41JXMN109186",
        "stockNumber": "TEST_S001",
        "fuelType": "Gasoline",
        "mpgCity": 22,
        "mpgHwy": 30,
        "condition": "Used",
        "description": "A great vehicle for testing.",
        "features": ["Sunroof", "Heated Seats", "Backup Camera"],
        "seatingRows": 2,
        "maxSeating": 5,
        "vehicleType": "SUV",
        "size": "midsize",
        "featured": True,
    }
    r = client.post(f"{API}/vehicles", json=payload, headers=auth_headers, timeout=20)
    assert r.status_code == 200, r.text
    body = r.json()
    CREATED_IDS.append(body["id"])
    # Verify all new fields persisted in response
    assert body["vin"] == payload["vin"]
    assert body["stockNumber"] == payload["stockNumber"]
    assert body["mpgCity"] == 22
    assert body["mpgHwy"] == 30
    assert body["features"] == payload["features"]
    assert body["images"] == payload["images"]
    assert body["seatingRows"] == 2
    assert body["maxSeating"] == 5
    assert body["fuelType"] == "Gasoline"
    assert body["interiorColor"] == "Tan"
    # GET to verify persisted
    r2 = client.get(f"{API}/vehicles/{body['id']}", timeout=20)
    assert r2.status_code == 200
    fetched = r2.json()
    assert fetched["vin"] == payload["vin"]
    assert fetched["features"] == payload["features"]
    assert "_id" not in fetched


# ---------- Update via PUT /api/vehicles/{id} ----------
def test_update_vehicle_new_fields(client, auth_headers):
    # Create
    create = client.post(f"{API}/vehicles", json={
        "year": 2022, "make": "TEST_UMake", "model": "UModel",
        "price": 30000, "mileage": 5000,
    }, headers=auth_headers, timeout=20)
    assert create.status_code == 200
    vid = create.json()["id"]
    CREATED_IDS.append(vid)
    # Update with new fields
    upd = {"vin": "UPDATED_VIN_123", "stockNumber": "TEST_S999", "features": ["A", "B"], "mpgCity": 18, "mpgHwy": 25}
    r = client.put(f"{API}/vehicles/{vid}", json=upd, headers=auth_headers, timeout=20)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["vin"] == "UPDATED_VIN_123"
    assert body["stockNumber"] == "TEST_S999"
    assert body["features"] == ["A", "B"]
    assert body["mpgCity"] == 18
    # GET to verify
    fetched = client.get(f"{API}/vehicles/{vid}", timeout=20).json()
    assert fetched["vin"] == "UPDATED_VIN_123"
    assert fetched["mpgHwy"] == 25


# ---------- Backwards compatibility ----------
def test_get_vehicles_backwards_compat(client):
    r = client.get(f"{API}/vehicles", timeout=20)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    # Every returned vehicle must have the new fields with safe defaults
    for v in data:
        assert "vin" in v
        assert "images" in v and isinstance(v["images"], list)
        assert "features" in v and isinstance(v["features"], list)
        assert "condition" in v
        assert "_id" not in v


# ---------- Multipart upload (create) ----------
def test_create_vehicle_with_uploads(client, auth_headers):
    payload = {
        "year": 2023, "make": "TEST_UpMake", "model": "UpModel",
        "trim": "Sport", "price": 35000, "mileage": 8000,
        "images": ["https://example.com/preexisting.jpg"],
        "features": ["X"],
    }
    files = [
        ("images", ("a.png", io.BytesIO(_png_bytes()), "image/png")),
        ("images", ("b.png", io.BytesIO(_png_bytes()), "image/png")),
    ]
    r = client.post(
        f"{API}/vehicles/upload",
        data={"data": json.dumps(payload)},
        files=files,
        headers=auth_headers,
        timeout=30,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    CREATED_IDS.append(body["id"])
    # Combined: 1 URL + 2 uploaded data URIs
    assert len(body["images"]) == 3
    assert body["images"][0] == "https://example.com/preexisting.jpg"
    for du in body["images"][1:]:
        assert du.startswith("data:image/png;base64,")
    # Primary image filled from first encoded if not provided
    assert body["image"]  # auto-assigned


# ---------- Multipart upload (update) ----------
def test_update_vehicle_with_uploads(client, auth_headers):
    create = client.post(f"{API}/vehicles", json={
        "year": 2021, "make": "TEST_UpdMake", "model": "UpdModel",
        "price": 20000, "mileage": 30000,
    }, headers=auth_headers, timeout=20)
    vid = create.json()["id"]
    CREATED_IDS.append(vid)
    files = [("images", ("c.png", io.BytesIO(_png_bytes()), "image/png"))]
    payload = {"images": [], "vin": "MULTIPART_VIN", "description": "Updated via multipart"}
    r = client.put(
        f"{API}/vehicles/{vid}/upload",
        data={"data": json.dumps(payload)},
        files=files,
        headers=auth_headers,
        timeout=30,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["vin"] == "MULTIPART_VIN"
    assert body["description"] == "Updated via multipart"
    assert len(body["images"]) == 1
    assert body["images"][0].startswith("data:image/png;base64,")


# ---------- 5MB limit enforcement ----------
def test_upload_size_limit(client, auth_headers):
    big = b"\x00" * (5 * 1024 * 1024 + 1024)  # > 5MB
    files = [("images", ("big.bin", io.BytesIO(big), "image/jpeg"))]
    payload = {"year": 2023, "make": "TEST_Big", "model": "Big", "price": 1000, "mileage": 1}
    r = client.post(
        f"{API}/vehicles/upload",
        data={"data": json.dumps(payload)},
        files=files,
        headers=auth_headers,
        timeout=60,
    )
    assert r.status_code == 413, f"Expected 413, got {r.status_code}: {r.text[:200]}"


# ---------- Invalid JSON in `data` ----------
def test_upload_invalid_json(client, auth_headers):
    r = client.post(
        f"{API}/vehicles/upload",
        data={"data": "not-json"},
        headers=auth_headers,
        timeout=20,
    )
    assert r.status_code == 400


# ---------- Missing vehicle update via multipart returns 404 ----------
def test_update_nonexistent_vehicle_upload(client, auth_headers):
    r = client.put(
        f"{API}/vehicles/nonexistent-id-xxx/upload",
        data={"data": json.dumps({"vin": "X"})},
        headers=auth_headers,
        timeout=20,
    )
    assert r.status_code == 404
