from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext


# ============================================================
# Configuration
# ============================================================

JWT_SECRET_KEY = "your-extremely-secure-and-secret-key-change-this"
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# ============================================================
# Password Hashing
# ============================================================

pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"],
    deprecated="auto",
)


def hash_password(password: str) -> str:
    """
    Hash a plaintext password.
    """
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify a plaintext password against its stored hash.
    """
    return pwd_context.verify(
        plain_password,
        hashed_password,
    )


# ============================================================
# JWT Creation
# ============================================================

def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a JWT access token.
    """

    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update(
        {
            "exp": expire,
        }
    )

    encoded_jwt = jwt.encode(
        to_encode,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )

    return encoded_jwt


# ============================================================
# JWT Decoding
# ============================================================

def decode_access_token(
    token: str,
) -> Optional[dict]:
    """
    Decode and validate a JWT.

    Returns:
        JWT payload if valid.
        None if invalid or expired.
    """

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
        )

        return payload

    except JWTError:
        return None


# ============================================================
# FastAPI Authentication
# ============================================================

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    FastAPI dependency that authenticates the current user.

    Expects:

        Authorization: Bearer <JWT>
    """

    token = credentials.credentials

    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    return user_id


def get_current_company(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    company_id = payload.get("sub")
    token_type = payload.get("type")

    if company_id is None or token_type != "company":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid company authentication token",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    return company_id


# ============================================================
# Example Protected Route Usage
# ============================================================

"""
Example:

from fastapi import APIRouter, Depends
from app.core.auth import get_current_user

router = APIRouter()


@router.get("/protected")
async def protected_route(
    current_user=Depends(get_current_user),
):
    return {
        "message": "You are authenticated",
        "user_id": current_user,
    }
"""


# ============================================================
# Local Test
# ============================================================

if __name__ == "__main__":

    fake_db_user = {
        "id": "user-123",
        "username": "johndoe",
        "hashed_password": hash_password("SecurePass789"),
    }

    print("--- User Login Simulation ---")

    login_username = "johndoe"
    login_password = "SecurePass789"

    if (
        login_username == fake_db_user["username"]
        and verify_password(
            login_password,
            fake_db_user["hashed_password"],
        )
    ):

        print("Password verified successfully!")

        user_payload = {
            "sub": fake_db_user["id"],
            "username": fake_db_user["username"],
        }

        token = create_access_token(
            data=user_payload,
        )

        print(f"Generated JWT:\n{token}\n")

        print("--- Token Verification ---")

        decoded_payload = decode_access_token(token)

        if decoded_payload:
            print("Access granted!")
            print(f"User ID: {decoded_payload['sub']}")
            print(f"Username: {decoded_payload['username']}")

    else:
        print("Authentication failed.")