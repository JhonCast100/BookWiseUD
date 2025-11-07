import jwt
import os
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User

security = HTTPBearer()

# Clave secreta de Spring Boot (codificada en Base64)
SECRET_KEY = "MTkxNTYyMDIzMTE4NTUxNDc5MTQ1NTE4OTE0NzE5NTEzOTE0MTE4"
ALGORITHM = "HS256"

# Decodificar la clave desde Base64
import base64
DECODED_KEY = base64.b64decode(SECRET_KEY)


def decode_jwt(token: str) -> dict:
    """
    Decodifica y valida el token JWT emitido por Spring Boot
    """
    try:
        if not token:
            raise HTTPException(status_code=401, detail="No token provided")
        
        print(f"Decoding token: {token[:20]}...")
        payload = jwt.decode(token, DECODED_KEY, algorithms=[ALGORITHM])
        print(f"✅ Decoded payload: {payload}")
        return payload
    except jwt.ExpiredSignatureError as e:
        print(f"❌ Token expired: {str(e)}")
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        print(f"❌ Invalid token: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        print(f"❌ Unexpected error decoding token: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Token error: {str(e)}")


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security), 
    db: Session = Depends(get_db)
) -> User:
    """
    Obtiene el usuario actual desde el token JWT.
    Si no existe en PostgreSQL, lo crea automáticamente.
    """
    token = credentials.credentials
    payload = decode_jwt(token)
    print("📋 Token payload:", payload)
    
    # ✅ Extraer email y auth_id del token
    email = payload.get("sub")
    auth_id = payload.get("auth_id")
    
    if email is None:
        raise HTTPException(status_code=400, detail="Invalid token: missing subject (email)")
    
    if auth_id is None:
        raise HTTPException(status_code=400, detail="Invalid token: missing auth_id")
    
    # Buscar usuario por email
    user = db.query(User).filter(User.email == email).first()
    
    # ✅ Si no existe, crear usuario con auth_id
    if not user:
        print(f"👤 Creating new user with email: {email}, auth_id: {auth_id}")
        
        user = User(
            email=email,
            full_name=email.split('@')[0],  # Nombre temporal
            status="active",
            auth_id=auth_id  # ✅ Guardar el ID de MySQL
        )
        db.add(user)
        
        try:
            db.commit()
            db.refresh(user)
            print(f"✅ User created successfully with ID: {user.user_id}, auth_id: {user.auth_id}")
        except Exception as e:
            print(f"❌ Error creating user: {str(e)}")
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail="Error creating user in database"
            )
    
    return user


def get_current_librarian(
    credentials: HTTPAuthorizationCredentials = Depends(security), 
    db: Session = Depends(get_db)
) -> User:
    """
    Verifica que el usuario actual sea un bibliotecario (ADMIN).
    """
    token = credentials.credentials
    payload = decode_jwt(token)
    
    # Verificar authorities desde el token
    authorities = payload.get("authorities", [])
    
    # Verificar si el usuario es admin
    is_admin = "ADMIN" in authorities or "ROLE_ADMIN" in authorities
    
    if not is_admin:
        raise HTTPException(
            status_code=403, 
            detail="Access denied. Admin role required."
        )
    
    # Obtener el correo electrónico del token
    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=400, detail="Invalid token: missing subject (email)")
    
    # Obtener el usuario por email
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user


def optional_auth(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)), 
    db: Session = Depends(get_db)
) -> User | None:
    """
    Autenticación opcional. Retorna el usuario si está autenticado, None si no.
    """
    if credentials is None:
        return None
    
    try:
        return get_current_user(credentials, db)
    except HTTPException:
        return None