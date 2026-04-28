"""Resend email integration. Non-blocking via asyncio.to_thread.
If RESEND_API_KEY is absent or empty, emails are silently skipped (dev mode)."""
import os
import asyncio
import logging
from pathlib import Path
import resend
from dotenv import load_dotenv

# Ensure env is loaded even if this module is imported before server.py calls load_dotenv
load_dotenv(Path(__file__).parent / '.env')

logger = logging.getLogger(__name__)

DEALERSHIP_NAME = 'Xen Motors Inc.'


def _get_api_key() -> str:
    return os.environ.get('RESEND_API_KEY', '').strip()


def _get_sender() -> str:
    return os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev').strip()


def _get_admin_email() -> str:
    return os.environ.get('ADMIN_EMAIL', 'xenmotors@gmail.com').strip()


def _is_enabled() -> bool:
    return bool(_get_api_key())


def _format_pairs(data: dict) -> str:
    """Render a dict into readable HTML rows, skipping empty values and photo blobs."""
    rows = []
    for key, value in data.items():
        if key in ('id', 'read', 'archived', 'createdAt', 'updatedAt'):
            continue
        if value is None or value == '' or value == [] or value == {}:
            continue
        if key in ('photos', 'damagePhoto', 'insuranceCard'):
            if isinstance(value, dict):
                if value.get('filename'):
                    rows.append(f"<tr><td style='padding:6px 12px;border-bottom:1px solid #eee;font-weight:600;text-transform:capitalize'>{key}</td><td style='padding:6px 12px;border-bottom:1px solid #eee'>{value.get('filename')}</td></tr>")
                else:  # photos dict
                    slot_names = ', '.join(value.keys())
                    rows.append(f"<tr><td style='padding:6px 12px;border-bottom:1px solid #eee;font-weight:600;text-transform:capitalize'>{key}</td><td style='padding:6px 12px;border-bottom:1px solid #eee'>{slot_names}</td></tr>")
            continue
        if isinstance(value, list):
            value = ', '.join(str(v) for v in value)
        label = key.replace('_', ' ').replace('FirstName', ' First Name').replace('LastName', ' Last Name')
        rows.append(f"<tr><td style='padding:6px 12px;border-bottom:1px solid #eee;font-weight:600;text-transform:capitalize'>{label}</td><td style='padding:6px 12px;border-bottom:1px solid #eee'>{value}</td></tr>")
    return ''.join(rows)


async def _send(params: dict) -> None:
    api_key = _get_api_key()
    if not api_key:
        logger.info("Resend disabled (no RESEND_API_KEY) - skipping email to %s", params.get('to'))
        return
    resend.api_key = api_key
    try:
        await asyncio.to_thread(resend.Emails.send, params)
        logger.info("Resend email sent to %s (subject: %s)", params.get('to'), params.get('subject'))
    except Exception as exc:
        logger.error("Resend send failed: %s", exc)


async def notify_admin(form_type: str, data: dict) -> None:
    """Send notification to dealership admin when a new form is submitted."""
    subject = f"[{DEALERSHIP_NAME}] New {form_type} submission"
    name = data.get('firstName') or data.get('name') or data.get('referralFirstName') or 'Unknown'
    last = data.get('lastName') or data.get('referralLastName') or ''
    email = data.get('email') or data.get('yourEmail') or 'N/A'
    phone = data.get('phone') or data.get('yourPhone') or 'N/A'

    html = f"""
    <div style='font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#222'>
      <div style='background:#111;color:#fff;padding:24px;text-align:center'>
        <h1 style='margin:0;font-size:22px;letter-spacing:1px'>{DEALERSHIP_NAME.upper()}</h1>
        <p style='margin:6px 0 0;font-size:14px;opacity:0.8'>New {form_type} Submission</p>
      </div>
      <div style='padding:20px;background:#f9f9f9'>
        <p><strong>Name:</strong> {name} {last}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <h3 style='margin-top:24px;font-size:15px;color:#111'>Full Details</h3>
        <table style='width:100%;border-collapse:collapse;background:#fff'>
          {_format_pairs(data)}
        </table>
      </div>
      <div style='padding:14px;text-align:center;font-size:12px;color:#777'>
        This notification was sent from xenmotors.com submission inbox.
      </div>
    </div>
    """
    await _send({
        "from": _get_sender(),
        "to": [_get_admin_email()],
        "subject": subject,
        "html": html,
    })


async def notify_customer(form_type: str, data: dict) -> None:
    """Send confirmation email to the customer who submitted a form."""
    customer_email = data.get('email') or data.get('yourEmail')
    if not customer_email:
        return
    name = data.get('firstName') or data.get('name') or data.get('yourFirstName') or 'there'

    subject_map = {
        'Contact Inquiry': "We received your message — Xen Motors",
        'Finance Application': "Your loan application is in — Xen Motors",
        'Trade-In Request': "We received your trade-in details — Xen Motors",
        'Glass Repair Request': "Your glass repair request is confirmed — Xen Motors",
        'Service Request': "We received your service request — Xen Motors",
        'Parts Request': "We received your parts request — Xen Motors",
        'Body Shop Request': "We received your estimate request — Xen Motors",
        'Warranty Appointment': "Warranty appointment request received — Xen Motors",
        'Warranty Info Request': "Warranty information on the way — Xen Motors",
        'Visit Request': "Visit request confirmed — Xen Motors",
        'Referral': "Thanks for the referral — Xen Motors",
    }
    subject = subject_map.get(form_type, f"We received your {form_type.lower()} — {DEALERSHIP_NAME}")

    html = f"""
    <div style='font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#222'>
      <div style='background:#111;color:#fff;padding:24px;text-align:center'>
        <h1 style='margin:0;font-size:22px;letter-spacing:1px'>XEN MOTORS</h1>
      </div>
      <div style='padding:24px;background:#fff'>
        <p>Hi {name},</p>
        <p>Thanks for reaching out to Xen Motors! We've received your <strong>{form_type.lower()}</strong> and our team will get back to you within one business day.</p>
        <p>If it's urgent, feel free to call us at <a href='tel:5167885722'>(516) 788-5722</a>.</p>
        <p style='margin-top:24px'>Best,<br/>The Xen Motors Team</p>
      </div>
      <div style='background:#f3f3f3;padding:14px;text-align:center;font-size:12px;color:#777'>
        45 W John Street Unit B, Hicksville, NY 11801 &middot; (516) 788-5722
      </div>
    </div>
    """
    await _send({
        "from": _get_sender(),
        "to": [customer_email],
        "subject": subject,
        "html": html,
    })
