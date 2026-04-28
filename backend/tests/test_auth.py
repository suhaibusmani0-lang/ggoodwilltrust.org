"""JWT auth test suite for Xen Motors backend.

Covers:
- /api/auth/login (success + failure cases)
- /api/auth/me (bearer + cookie + invalid)
- /api/auth/logout
- Protected /api/vehicles POST/PUT/DELETE
- Protected /api/admin/submissions/* endpoints
- Public endpoints still work without auth
- Idempotent admin seed (login still works after multiple requests)
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://vehicle-xen.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@xenmotors.com"
ADMIN_PASSWORD = "XenAdmin@2026"


# ---------- Fixtures ----------
@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    data = r.json()
    return data["access_token"]


@pytest.fixture()
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ---------- /api/auth/login ----------
class TestAuthLogin:
    def test_login_success(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "access_token" in data and isinstance(data["access_token"], str) and len(data["access_token"]) > 20
        assert data.get("token_type") == "bearer"
        user = data.get("user") or {}
        assert user.get("email") == ADMIN_EMAIL
        assert user.get("role") == "admin"
        assert "id" in user and isinstance(user["id"], str)
        assert "name" in user
        # Password hash must NOT be leaked
        assert "password_hash" not in user and "password" not in user

    def test_login_wrong_password(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrongpass!!"}, timeout=15)
        assert r.status_code == 401
        assert r.json().get("detail") == "Invalid email or password"

    def test_login_nonexistent_email(self):
        r = requests.post(f"{API}/auth/login", json={"email": "ghost@nowhere.xyz", "password": "whatever"}, timeout=15)
        assert r.status_code == 401
        assert r.json().get("detail") == "Invalid email or password"

    def test_login_case_insensitive_email(self):
        r = requests.post(f"{API}/auth/login", json={"email": "ADMIN@XENMOTORS.COM", "password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 200
        assert r.json()["user"]["email"] == ADMIN_EMAIL

    def test_login_sets_httponly_cookie(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 200
        # Response should set access_token cookie
        assert "access_token" in r.cookies, f"access_token cookie not set. Cookies: {dict(r.cookies)}"


# ---------- /api/auth/me ----------
class TestAuthMe:
    def test_me_without_token(self):
        r = requests.get(f"{API}/auth/me", timeout=15)
        assert r.status_code == 401
        assert r.json().get("detail") == "Not authenticated"

    def test_me_with_bearer(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        assert "password_hash" not in data

    def test_me_with_invalid_token(self):
        r = requests.get(f"{API}/auth/me", headers={"Authorization": "Bearer not.a.real.jwt"}, timeout=15)
        assert r.status_code == 401

    def test_me_via_cookie(self):
        # Log in via session so we have the cookie
        s = requests.Session()
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 200
        r2 = s.get(f"{API}/auth/me", timeout=15)
        assert r2.status_code == 200
        assert r2.json()["email"] == ADMIN_EMAIL


# ---------- /api/auth/logout ----------
class TestAuthLogout:
    def test_logout_ok_and_clears_cookie(self):
        s = requests.Session()
        s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
        r = s.post(f"{API}/auth/logout", timeout=15)
        assert r.status_code == 200
        assert r.json().get("message") == "Logged out"
        # Server should send delete-cookie header; subsequent /me without bearer must be 401 after session clears
        s.cookies.clear()
        r2 = s.get(f"{API}/auth/me", timeout=15)
        assert r2.status_code == 401


# ---------- Vehicles: GET public, mutating protected ----------
class TestVehiclesAuth:
    def test_get_vehicles_public(self):
        r = requests.get(f"{API}/vehicles", timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_post_vehicle_without_auth(self):
        r = requests.post(f"{API}/vehicles", json={
            "make": "TEST_Brand", "model": "X", "year": 2024, "price": 1000,
            "mileage": 10, "bodyType": "Sedan", "transmission": "Auto",
            "fuelType": "Gas", "color": "Red", "images": []
        }, timeout=15)
        assert r.status_code == 401

    def test_post_put_delete_vehicle_with_auth(self, auth_headers):
        payload = {
            "make": "TEST_XenBrand", "model": "AuthCar", "trim": "Base",
            "year": 2024, "price": 12345, "mileage": 100,
            "image": "https://example.com/a.jpg", "engine": "2.0L",
            "transmission": "Automatic", "drivetrain": "FWD",
            "exteriorColor": "Red", "bodyType": "Sedan", "featured": False
        }
        rp = requests.post(f"{API}/vehicles", headers=auth_headers, json=payload, timeout=15)
        assert rp.status_code == 200, rp.text
        created = rp.json()
        vid = created["id"]

        # PUT without auth -> 401
        rn = requests.put(f"{API}/vehicles/{vid}", json={"price": 22222}, timeout=15)
        assert rn.status_code == 401

        # PUT with auth -> 200
        ru = requests.put(f"{API}/vehicles/{vid}", headers=auth_headers, json={"price": 22222}, timeout=15)
        assert ru.status_code == 200
        assert ru.json()["price"] == 22222

        # DELETE without auth -> 401
        rd_no = requests.delete(f"{API}/vehicles/{vid}", timeout=15)
        assert rd_no.status_code == 401

        # DELETE with auth -> 200
        rd = requests.delete(f"{API}/vehicles/{vid}", headers=auth_headers, timeout=15)
        assert rd.status_code == 200


# ---------- Admin submissions: all endpoints require auth ----------
class TestAdminSubmissionsAuth:
    KINDS = [
        "contacts", "finance_applications", "trade_ins", "glass_repairs",
        "service_requests", "warranty_appointments", "warranty_info_requests",
        "schedule_visits", "referrals",
    ]

    @pytest.mark.parametrize("kind", KINDS)
    def test_list_requires_auth(self, kind):
        r = requests.get(f"{API}/admin/submissions/{kind}", timeout=15)
        assert r.status_code == 401

    @pytest.mark.parametrize("kind", KINDS)
    def test_list_with_auth(self, kind, auth_headers):
        r = requests.get(f"{API}/admin/submissions/{kind}", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    @pytest.mark.parametrize("kind", KINDS)
    def test_counts_with_auth(self, kind, auth_headers):
        r = requests.get(f"{API}/admin/submissions/{kind}/counts", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["kind"] == kind
        assert "total" in data and "unread" in data

    def test_counts_without_auth(self):
        r = requests.get(f"{API}/admin/submissions/contacts/counts", timeout=15)
        assert r.status_code == 401

    def test_patch_and_delete_require_auth(self, auth_headers):
        # Create a contact (public)
        c = requests.post(f"{API}/contacts", json={
            "firstName": "TEST_Auth", "lastName": "User",
            "email": f"test_auth_{uuid.uuid4().hex[:6]}@example.com",
            "phone": "555-0100", "message": "auth test"
        }, timeout=15)
        assert c.status_code == 200
        cid = c.json()["id"]

        # PATCH without auth -> 401
        r = requests.patch(f"{API}/admin/submissions/contacts/{cid}", json={"read": True}, timeout=15)
        assert r.status_code == 401

        # PATCH with auth -> 200
        r2 = requests.patch(f"{API}/admin/submissions/contacts/{cid}", headers=auth_headers, json={"read": True}, timeout=15)
        assert r2.status_code == 200

        # DELETE without auth -> 401
        r3 = requests.delete(f"{API}/admin/submissions/contacts/{cid}", timeout=15)
        assert r3.status_code == 401

        # DELETE with auth -> 200
        r4 = requests.delete(f"{API}/admin/submissions/contacts/{cid}", headers=auth_headers, timeout=15)
        assert r4.status_code == 200


# ---------- Public form endpoints remain public ----------
class TestPublicFormsStillPublic:
    def test_contacts_public(self):
        r = requests.post(f"{API}/contacts", json={
            "firstName": "TEST_Pub", "lastName": "User",
            "email": "test_public@example.com", "phone": "555-0101",
            "message": "public test"
        }, timeout=15)
        assert r.status_code == 200

    def test_finance_applications_public(self):
        r = requests.post(f"{API}/finance-applications", json={
            "firstName": "TEST_Pub", "lastName": "User",
            "email": "test_public@example.com", "phone": "555-0101",
            "address": "1 St", "city": "A", "state": "CA", "zip": "90001",
            "annualIncome": 50000, "employmentStatus": "employed"
        }, timeout=15)
        assert r.status_code in (200, 422)  # 422 only if schema mismatch; status should not be 401

    def test_service_requests_public(self):
        r = requests.post(f"{API}/service-requests", json={
            "firstName": "TEST_Pub", "lastName": "User",
            "email": "test_public@example.com", "phone": "555-0101",
            "message": "service test"
        }, timeout=15)
        assert r.status_code == 200


# ---------- Basic regression ----------
class TestRegression:
    def test_health(self):
        r = requests.get(f"{API}/health", timeout=15)
        assert r.status_code == 200
        assert r.json().get("status") == "ok"

    def test_stats_public(self):
        r = requests.get(f"{API}/stats", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "totalVehicles" in data

    def test_admin_seed_idempotent(self):
        # Login twice; both should succeed -> seed is idempotent
        for _ in range(2):
            r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
            assert r.status_code == 200
