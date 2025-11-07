import jwt
import base64
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User

security = HTTPBearer()

# Igual que Spring: Base64 key + HS256
SECRET_KEY = "MTkxNTYyMDIzMTE4NTUxNDc5MTQ1NTE4OTE0NzE5NTEzOTE0MTE4"
ALGORITHM = "HS256"
DECODED_KEY = base64.b64decode(SECRET_KEY)


def decode_jwt(token: str) -> dict:
    try:
        if not token:
            raise HTTPException(status_code=401, detail="No token provided")

        payload = jwt.decode(token, DECODED_KEY, algorithms=[ALGORITHM])
        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:

    token = credentials.credentials
    payload = decode_jwt(token)

    # ✅ Extraemos los datos del token
    user_id = payload.get("id")
    username = payload.get("username")
    rol = payload.get("rol")

    if username is None:
        raise HTTPException(status_code=400, detail="Invalid token: missing username")

    # Buscar usuario por email/username
    user = db.query(User).filter(User.email == username).first()

    # ✅ Si no existe, lo creamos automáticamente
    if not user:
        user = User(
            auth_id=user_id,              # Guardamos el id de Spring
            email=username,
            full_name=username.split("@")[0],
            status="active"
        )

        db.add(user)
        db.commit()
        db.refresh(user)

    return user


def get_current_librarian(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:

    token = credentials.credentials
    payload = decode_jwt(token)

    rol = payload.get("rol")

    if rol != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin role required")

    # Obtener usuario por username
    username = payload.get("username")
    user = db.query(User).filter(User.email == username).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


def optional_auth(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_db)
) -> User | None:

    if credentials is None:
        return None
    
    try:
        return get_current_user(credentials, db)
    except:
        return None
