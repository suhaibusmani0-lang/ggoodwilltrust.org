"""JWT-based custom authentication for admin-only access.
- bcrypt password hashing
- PyJWT HS256 tokens with 7-day expiration
- get_current_user dependency supports both Bearer Authorization header and
  access_token cookie (playbook-compatible)."""
import os
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional

import bcrypt
import jwt
from fastapi import Depends, HTTPException, Request
from pydantic import BaseModel

logger = logging.getLogger(__name__)

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7


# ==================== Password helpers ====================
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except ValueError:
        return False


# ==================== JWT helpers ====================
def _get_jwt_secret() -> str:
    secret = os.environ.get("JWT_SECRET", "").strip()
    if not secret:
        raise RuntimeError("JWT_SECRET is not set in environment")
    return secret


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS),
        "iat": datetime.now(timezone.utc),
        "type": "access",
    }
    return jwt.encode(payload, _get_jwt_secret(), algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, _get_jwt_secret(), algorithms=[JWT_ALGORITHM])


# ==================== Pydantic models ====================
class LoginPayload(BaseModel):
    email: str
    password: str


class AuthUser(BaseModel):
    id: str
    email: str
    name: str
    role: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AuthUser


# ==================== Auth dependencies ====================
async def _extract_token(request: Request) -> Optional[str]:
    token = request.cookies.get("access_token")
    if token:
        return token
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header[7:]
    return None


def _build_get_current_user(users_collection):
    async def get_current_user(request: Request) -> dict:
        token = await _extract_token(request)
        if not token:
            raise HTTPException(status_code=401, detail="Not authenticated")
        try:
            payload = decode_token(token)
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        user = await users_collection.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user

    return get_current_user


# ==================== Admin seeding ====================
async def seed_admin(users_collection) -> None:
    """Create or update the single admin user based on env vars. Idempotent."""
    import uuid

    admin_email = os.environ.get("ADMIN_LOGIN_EMAIL", "admin@xenmotors.com").strip().lower()
    admin_password = os.environ.get("ADMIN_LOGIN_PASSWORD", "XenAdmin@2026")

    existing = await users_collection.find_one({"email": admin_email})
    if existing is None:
        await users_collection.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Xen Motors Admin",
            "role": "admin",
            "createdAt": datetime.now(timezone.utc),
        })
        logger.info("Seeded admin user %s", admin_email)
        return

    # If env password changed, update hash
    if not verify_password(admin_password, existing.get("password_hash", "")):
        await users_collection.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password), "updatedAt": datetime.now(timezone.utc)}},
        )
        logger.info("Updated admin password hash for %s", admin_email)


# ==================== Router factory ====================
def build_auth_router(users_collection):
    from fastapi import APIRouter, Response

    router = APIRouter(prefix="/auth", tags=["auth"])
    get_current_user = _build_get_current_user(users_collection)

    @router.post("/login", response_model=LoginResponse)
    async def login(payload: LoginPayload, response: Response):
        email = payload.email.strip().lower()
        user = await users_collection.find_one({"email": email})
        if not user or not verify_password(payload.password, user.get("password_hash", "")):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_access_token(user["id"], email)
        # Optional httpOnly cookie (the FE primarily uses Bearer header + localStorage)
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=ACCESS_TOKEN_EXPIRE_DAYS * 24 * 3600,
            path="/",
        )
        return LoginResponse(
            access_token=token,
            user=AuthUser(
                id=user["id"],
                email=user["email"],
                name=user.get("name", ""),
                role=user.get("role", "admin"),
            ),
        )

    @router.post("/logout")
    async def logout(response: Response):
        response.delete_cookie("access_token", path="/")
        return {"message": "Logged out"}

    @router.get("/me", response_model=AuthUser)
    async def me(user: dict = Depends(get_current_user)):
        return AuthUser(
            id=user["id"],
            email=user["email"],
            name=user.get("name", ""),
            role=user.get("role", "admin"),
        )

    return router, get_current_user
