import jwt
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
import os

security = HTTPBearer()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")


def decode_jwt(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # Contiene auth_id, email, roles, etc.
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user(token: str = Depends(security), db: Session = Depends(get_db)):
    # Obtener solo el valor del token del header "Authorization: Bearer <token>"
    token_str = token.credentials
    payload = decode_jwt(token_str)

    auth_id = payload.get("auth_id")
    if auth_id is None:
        raise HTTPException(status_code=400, detail="Invalid token: missing auth_id")

    user = db.query(User).filter(User.auth_id == auth_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found in local DB")

    return user
