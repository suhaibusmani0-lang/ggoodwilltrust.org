// Input validation and rate limiting utilities

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s()-]{7,15}$/;
const PAN_RE = /^[A-Z]{5}\d{4}[A-Z]$/;

export function sanitize(str: string): string {
  return str.trim().replace(/[<>]/g, '');
}

export function validateEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  return PHONE_RE.test(phone.trim());
}

export function validatePAN(pan: string): boolean {
  if (!pan) return true; // PAN is optional
  return PAN_RE.test(pan.trim().toUpperCase());
}

export function validateName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
}

export function validateAmount(amount: number): boolean {
  return !isNaN(amount) && amount >= 1 && amount <= 1000000;
}

export function validateMessage(msg: string, maxLen = 2000): boolean {
  return msg.trim().length >= 5 && msg.trim().length <= maxLen;
}

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxRequests = 5,
  windowMs = 3600000 // 1 hour
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}

// Clean up expired entries periodically (every 10 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetAt) rateLimitMap.delete(key);
    }
  }, 600000);
}

