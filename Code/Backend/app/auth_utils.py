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
        # Añadir verificación de token vacío o None
        if not token:
            raise HTTPException(status_code=401, detail="No token provided")
        
        print(f"Decoding token: {token[:20]}...")  # Imprime los primeros 20 caracteres del token
        payload = jwt.decode(token, DECODED_KEY, algorithms=[ALGORITHM])
        print(f"Decoded payload: {payload}")  # Imprime el contenido del token
        return payload  # Contiene: auth_id, email, roles, exp, etc.
    except jwt.ExpiredSignatureError as e:
        print(f"Token expired: {str(e)}")
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        print(f"Invalid token: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        print(f"Unexpected error decoding token: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Token error: {str(e)}")


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
    print("Token payload:", payload)  # Para depuración
    
    # Obtener el correo electrónico del subject del token
    email = payload.get("sub")  # Spring Boot usa 'sub' para el email
    if email is None:
        raise HTTPException(status_code=400, detail="Invalid token: missing subject (email)")
    
    # Buscar el usuario por email
    user = db.query(User).filter(User.email == email).first()
    
    # Si el usuario no existe, lo creamos
    if not user:
        print(f"Creating new user with email: {email}")
        
        # Crear el usuario
        user = User(
            email=email,
            full_name=email.split('@')[0],  # Usamos parte del email como nombre temporal
            status="active",
            # No necesitamos auth_id ya que usaremos email para la relación
        )
        db.add(user)
        
        try:
            db.commit()
            db.refresh(user)
            print(f"User created successfully with ID: {user.user_id}")
        except Exception as e:
            print(f"Error creating user: {str(e)}")
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
    Verifica que el usuario actual sea un bibliotecario.
    Útil para endpoints que requieren permisos de librarian.
    """
    token = credentials.credentials
    payload = decode_jwt(token)
    
    # Verificar roles desde el token
    roles = payload.get("role", [])  # Spring Boot usa "role" en singular
    if roles != "ADMIN":  # Spring Boot usa "ADMIN" para bibliotecarios
        raise HTTPException(
            status_code=403, 
            detail="Access denied. Administrator role required."
        )
    
    # Obtener el email del token
    email = payload.get("sub")  # Spring Boot usa 'sub' para el email
    if email is None:
        raise HTTPException(status_code=400, detail="Invalid token: missing subject (email)")
    
    # Buscar el usuario por email
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Si el usuario no existe en la base de datos de FastAPI, lo creamos
        user = User(
            email=email,
            full_name=email.split('@')[0],  # Usamos parte del email como nombre temporal
            status="active"
        )
        db.add(user)
        try:
            db.commit()
            db.refresh(user)
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail="Error creating user in database"
            )
    
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