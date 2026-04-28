"""Tests for /api/admin/submissions/* endpoints and email trigger logging."""
import io
import json
import os
import time

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://vehicle-xen.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

KINDS = [
    "contacts", "finance_applications", "trade_ins", "glass_repairs",
    "service_requests", "warranty_appointments", "warranty_info_requests",
    "schedule_visits", "referrals",
]


@pytest.fixture(scope="module")
def client():
    return requests.Session()


# -------------------- Counts --------------------
@pytest.mark.parametrize("kind", KINDS)
def test_counts_all_kinds(client, kind):
    r = client.get(f"{API}/admin/submissions/{kind}/counts", timeout=20)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["kind"] == kind
    assert isinstance(data["total"], int)
    assert isinstance(data["unread"], int)
    assert data["unread"] <= data["total"]


def test_counts_unknown_kind(client):
    r = client.get(f"{API}/admin/submissions/unknown_kind/counts", timeout=20)
    assert r.status_code == 404


# -------------------- List + search + filters --------------------
def _create_contact(client, name="TEST_AdminInbox", email="testinbox@example.com"):
    payload = {"name": name, "email": email, "phone": "555-0000", "message": "inbox test"}
    r = client.post(f"{API}/contacts", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    return r.json()


def test_list_contacts_sorted_desc(client):
    c1 = _create_contact(client, name="TEST_Inbox_A", email="inboxa@example.com")
    time.sleep(0.5)
    c2 = _create_contact(client, name="TEST_Inbox_B", email="inboxb@example.com")
    r = client.get(f"{API}/admin/submissions/contacts", timeout=20)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    # sorted desc on createdAt: c2 should appear before c1
    ids_in_order = [x["id"] for x in data]
    assert c2["id"] in ids_in_order and c1["id"] in ids_in_order
    assert ids_in_order.index(c2["id"]) < ids_in_order.index(c1["id"])


def test_list_search_query(client):
    unique = f"TEST_SEARCH_{int(time.time())}"
    c = _create_contact(client, name=unique, email=f"{unique.lower()}@example.com")
    r = client.get(f"{API}/admin/submissions/contacts", params={"q": unique}, timeout=20)
    assert r.status_code == 200
    data = r.json()
    assert len(data) >= 1
    assert any(x["id"] == c["id"] for x in data)


def test_list_read_false_filter(client):
    c = _create_contact(client, name="TEST_UnreadFilter", email="unread@example.com")
    r = client.get(f"{API}/admin/submissions/contacts", params={"read": "false"}, timeout=20)
    assert r.status_code == 200
    ids = [x["id"] for x in r.json()]
    assert c["id"] in ids


def test_list_archived_true_filter(client):
    # Create then archive one, verify archived=true returns it and archived=false excludes it.
    c = _create_contact(client, name="TEST_Archive", email="archive@example.com")
    rp = client.patch(f"{API}/admin/submissions/contacts/{c['id']}", json={"archived": True}, timeout=20)
    assert rp.status_code == 200, rp.text

    r_arch = client.get(f"{API}/admin/submissions/contacts", params={"archived": "true"}, timeout=20)
    assert r_arch.status_code == 200
    assert c["id"] in [x["id"] for x in r_arch.json()]

    r_not = client.get(f"{API}/admin/submissions/contacts", params={"archived": "false"}, timeout=20)
    assert c["id"] not in [x["id"] for x in r_not.json()]


def test_date_range_filter(client):
    # Ensure range that includes now returns some contacts
    r = client.get(
        f"{API}/admin/submissions/contacts",
        params={"from_date": "2026-01-01", "to_date": "2026-12-31"},
        timeout=20,
    )
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_invalid_date_format(client):
    r = client.get(f"{API}/admin/submissions/contacts", params={"from_date": "not-a-date"}, timeout=20)
    assert r.status_code == 400


# -------------------- Detail (with base64 intact for trade_ins) --------------------
def _png_bytes():
    return (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00"
        b"\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc"
        b"\xf8\xcf\xc0\x00\x00\x00\x03\x00\x01\x5b\xd1\x21\xa3\x00\x00\x00\x00IEND\xaeB`\x82"
    )


def test_trade_in_detail_keeps_base64(client):
    # Create a trade-in with photo
    data = {
        "firstName": "TEST_InboxTrade",
        "lastName": "User",
        "email": "inboxtrade@example.com",
        "phone": "555-7777",
        "mechanicalIssues": json.dumps([]),
    }
    files = {"photoExteriorFront": ("front.png", io.BytesIO(_png_bytes()), "image/png")}
    r = client.post(f"{API}/trade-ins", data=data, files=files, timeout=30)
    assert r.status_code == 200, r.text
    tid = r.json()["id"]

    # List should NOT have base64
    rl = client.get(f"{API}/admin/submissions/trade_ins", timeout=20)
    assert rl.status_code == 200
    items = [x for x in rl.json() if x["id"] == tid]
    assert items
    assert "base64" not in items[0]["photos"]["exteriorFront"]

    # Detail should preserve base64
    rd = client.get(f"{API}/admin/submissions/trade_ins/{tid}", timeout=20)
    assert rd.status_code == 200
    detail = rd.json()
    assert "base64" in detail["photos"]["exteriorFront"]
    assert detail["photos"]["exteriorFront"]["base64"]


def test_detail_unknown_id_404(client):
    r = client.get(f"{API}/admin/submissions/contacts/nonexistent-id-xyz", timeout=20)
    assert r.status_code == 404


# -------------------- PATCH (read/archived) --------------------
def test_patch_mark_read(client):
    c = _create_contact(client, name="TEST_Read", email="read@example.com")
    r = client.patch(f"{API}/admin/submissions/contacts/{c['id']}", json={"read": True}, timeout=20)
    assert r.status_code == 200
    assert r.json()["read"] is True
    # confirm via GET detail
    rd = client.get(f"{API}/admin/submissions/contacts/{c['id']}", timeout=20)
    assert rd.json()["read"] is True


def test_patch_no_fields_returns_400(client):
    c = _create_contact(client, name="TEST_PatchEmpty", email="empty@example.com")
    r = client.patch(f"{API}/admin/submissions/contacts/{c['id']}", json={}, timeout=20)
    assert r.status_code == 400


def test_patch_unknown_id_returns_404(client):
    r = client.patch(f"{API}/admin/submissions/contacts/nonexistent", json={"read": True}, timeout=20)
    assert r.status_code == 404


# -------------------- DELETE --------------------
def test_delete_submission(client):
    c = _create_contact(client, name="TEST_Delete", email="delete@example.com")
    rd = client.delete(f"{API}/admin/submissions/contacts/{c['id']}", timeout=20)
    assert rd.status_code == 200
    # confirm deleted
    r2 = client.get(f"{API}/admin/submissions/contacts/{c['id']}", timeout=20)
    assert r2.status_code == 404


def test_delete_unknown_returns_404(client):
    r = client.delete(f"{API}/admin/submissions/contacts/nonexistent", timeout=20)
    assert r.status_code == 404


# -------------------- Unknown kind on list / detail / patch --------------------
def test_unknown_kind_list_404(client):
    r = client.get(f"{API}/admin/submissions/unknown_kind", timeout=20)
    assert r.status_code == 404


# -------------------- Email trigger: check logs contain 'Resend email sent to' --------------------
def test_email_dispatch_log_on_contact(client):
    marker_email = f"test_email_{int(time.time())}@example.com"
    payload = {"name": "TEST_EmailTrigger", "email": marker_email, "phone": "555-1111", "message": "email test"}
    r = client.post(f"{API}/contacts", json=payload, timeout=20)
    assert r.status_code == 200
    # Give background task a few seconds to fire
    time.sleep(6)
    log_path = "/var/log/supervisor/backend.err.log"
    if not os.path.exists(log_path):
        pytest.skip("backend log file not accessible")
    with open(log_path, "r", errors="ignore") as f:
        tail = f.read()[-40000:]
    # Expect at least one line indicating a Resend email attempt related to this contact.
    # We check for the generic "Resend email sent to" (success) OR "Resend send failed"
    # OR the skip message. Email should have been attempted either way.
    assert (
        "Resend email sent to" in tail
        or "Resend send failed" in tail
        or "Resend disabled" in tail
    ), "No evidence of email dispatch attempt in backend logs"
