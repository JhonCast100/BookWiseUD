import jwt
import os
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User

security = HTTPBearer()

# Estas variables deben coincidir con las de Spring Boot
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-here")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")


def decode_jwt(token: str) -> dict:
    """
    Decodifica y valida el token JWT emitido por Spring Boot
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # Contiene: auth_id, email, roles, exp, etc.
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security), 
    db: Session = Depends(get_db)
) -> User:
    """
    Obtiene el usuario actual desde el token JWT.
    Este usuario debe existir en la base de datos de FastAPI.
    """
    # Extraer el token del header Authorization: Bearer <token>
    token = credentials.credentials
    
    # Decodificar el token
    payload = decode_jwt(token)
    
    # Obtener el auth_id (ID del sistema de autenticación de Spring Boot)
    auth_id = payload.get("auth_id")
    if auth_id is None:
        raise HTTPException(status_code=400, detail="Invalid token: missing auth_id")
    
    # Buscar el usuario en la base de datos local usando auth_id
    user = db.query(User).filter(User.auth_id == auth_id).first()
    
    if not user:
        raise HTTPException(
            status_code=404, 
            detail="User not found. Please contact administrator."
        )
    
    return user


def get_current_librarian(
    credentials: HTTPAuthorizationCredentials = Depends(security), 
    db: Session = Depends(get_db)
) -> User:
    """
    Verifica que el usuario actual sea un bibliotecario.
    Útil para endpoints que requieren permisos de librarian.
    """
    token = credentials.credentials
    payload = decode_jwt(token)
    
    # Verificar roles desde el token
    roles = payload.get("roles", [])
    if "ROLE_LIBRARIAN" not in roles:
        raise HTTPException(
            status_code=403, 
            detail="Access denied. Librarian role required."
        )
    
    # También obtener el usuario desde la DB
    auth_id = payload.get("auth_id")
    user = db.query(User).filter(User.auth_id == auth_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user


def optional_auth(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)), 
    db: Session = Depends(get_db)
) -> User | None:
    """
    Autenticación opcional. Retorna el usuario si está autenticado, None si no.
    Útil para endpoints públicos que pueden personalizar la respuesta si hay usuario.
    """
    if credentials is None:
        return None
    
    try:
        return get_current_user(credentials, db)
    except HTTPException:
        return None