# tests/test_utils.py
import pytest
import jwt
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from app import auth_utils
import base64

SECRET_KEY = "MTkxNTYyMDIzMTE4NTUxNDc5MTQ1NTE4OTE0NzE5NTEzOTE0MTE4"
ALGORITHM = "HS256"
DECODED_KEY = base64.b64decode(SECRET_KEY)


def test_decode_jwt_valid():
    """Debe decodificar un token JWT válido"""
    payload = {
        "username": "test@example.com",
        "id": 1,
        "rol": "USER",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    token = jwt.encode(payload, DECODED_KEY, algorithm=ALGORITHM)
    
    decoded = auth_utils.decode_jwt(token)
    assert decoded["username"] == "test@example.com"


def test_decode_jwt_expired():
    """Debe lanzar HTTPException para token expirado"""
    payload = {
        "username": "test@example.com",
        "id": 1,
        "rol": "USER",
        "exp": datetime.now(timezone.utc) - timedelta(hours=1)  # Token expirado
    }
    token = jwt.encode(payload, DECODED_KEY, algorithm=ALGORITHM)
    
    with pytest.raises(HTTPException) as exc_info:
        auth_utils.decode_jwt(token)
    assert exc_info.value.status_code == 401


def test_decode_jwt_invalid():
    """Debe lanzar HTTPException para token inválido"""
    with pytest.raises(HTTPException) as exc_info:
        auth_utils.decode_jwt("invalid_token_string")
    assert exc_info.value.status_code == 401


def test_get_current_user_existing(db_session, sample_user):
    """Debe obtener usuario existente del token"""
    from fastapi.security import HTTPAuthorizationCredentials
    
    # Crear token para usuario existente
    payload = {
        "username": sample_user.email,
        "id": sample_user.auth_id,
        "rol": "USER",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    token = jwt.encode(payload, DECODED_KEY, algorithm=ALGORITHM)
    
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    user = auth_utils.get_current_user(credentials, db_session)
    
    assert user is not None
    assert user.email == sample_user.email


def test_get_current_user_auto_create(db_session):
    """Debe crear usuario automáticamente si no existe"""
    from fastapi.security import HTTPAuthorizationCredentials
    
    # Crear token para usuario nuevo
    payload = {
        "username": "newuser@example.com",
        "id": 999,
        "rol": "USER",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    token = jwt.encode(payload, DECODED_KEY, algorithm=ALGORITHM)
    
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    user = auth_utils.get_current_user(credentials, db_session)
    
    assert user is not None
    assert user.email == "newuser@example.com"
    assert user.status == "active"


def test_get_current_librarian_admin(db_session, admin_user):
    """Debe permitir acceso a usuario con rol ADMIN"""
    from fastapi.security import HTTPAuthorizationCredentials
    
    payload = {
        "username": admin_user.email,
        "id": admin_user.auth_id,
        "rol": "ADMIN",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    token = jwt.encode(payload, DECODED_KEY, algorithm=ALGORITHM)
    
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    user = auth_utils.get_current_librarian(credentials, db_session)
    
    assert user is not None
    assert user.email == admin_user.email


def test_get_current_librarian_forbidden(db_session, sample_user):
    """Debe denegar acceso a usuario sin rol ADMIN"""
    from fastapi.security import HTTPAuthorizationCredentials
    
    payload = {
        "username": sample_user.email,
        "id": sample_user.auth_id,
        "rol": "USER",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    token = jwt.encode(payload, DECODED_KEY, algorithm=ALGORITHM)
    
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    
    with pytest.raises(HTTPException) as exc_info:
        auth_utils.get_current_librarian(credentials, db_session)
    assert exc_info.value.status_code == 403


def test_optional_auth_with_token(db_session, sample_user):
    """Debe retornar usuario cuando hay token"""
    from fastapi.security import HTTPAuthorizationCredentials
    
    payload = {
        "username": sample_user.email,
        "id": sample_user.auth_id,
        "rol": "USER",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    token = jwt.encode(payload, DECODED_KEY, algorithm=ALGORITHM)
    
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    user = auth_utils.optional_auth(credentials, db_session)
    
    assert user is not None
    assert user.email == sample_user.email


def test_optional_auth_without_token(db_session):
    """Debe retornar None cuando no hay token"""
    user = auth_utils.optional_auth(None, db_session)
    assert user is None