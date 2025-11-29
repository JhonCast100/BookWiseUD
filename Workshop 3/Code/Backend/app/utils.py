# app/utils.py
import jwt
from datetime import datetime, timezone
from fastapi import HTTPException, Depends

# Simulación de CRUD de usuarios (para tests)
class User:
    def __init__(self, username, role="user"):
        self.username = username
        self.role = role

# Dummy "base de datos" para tests
_users_db = {}

def get_user_by_username(username):
    return _users_db.get(username)

def create_user(data):
    user = User(username=data["username"], role=data.get("role", "user"))
    _users_db[data["username"]] = user
    return user

# JWT Settings
SECRET_KEY = "secret"
ALGORITHM = "HS256"

# 🔹 Funciones de autenticación
def decode_jwt(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        exp = payload.get("exp")
        if exp and datetime.now(timezone.utc).timestamp() > exp:
            raise HTTPException(status_code=401, detail="Token expired")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(token: str = Depends()):
    payload = decode_jwt(token)
    username = payload.get("username")
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = get_user_by_username(username)
    if not user:
        user = create_user({"username": username})
    return user

def get_current_librarian(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return current_user

def optional_auth(token: str = None):
    if token:
        return get_current_user(token)
    return None
