# tests/test_auth.py
import pytest
import jwt
import base64
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from app.auth_utils import decode_jwt, get_current_user, get_current_librarian

SECRET_KEY = "MTkxNTYyMDIzMTE4NTUxNDc5MTQ1NTE4OTE0NzE5NTEzOTE0MTE4"
DECODED_KEY = base64.b64decode(SECRET_KEY)
ALGORITHM = "HS256"


class TestJWTDecoding:
    """Pruebas de decodificación de tokens JWT"""
    
    def test_decode_valid_token(self):
        """Debe decodificar un token válido correctamente"""
        payload = {
            "id": 1,
            "username": "test@example.com",
            "rol": "USER",
            "exp": datetime.now(timezone.utc) + timedelta(hours=1)
        }
        token = jwt.encode(payload, DECODED_KEY, algorithm=ALGORITHM)
        
        decoded = decode_jwt(token)
        assert decoded["username"] == "test@example.com"
        assert decoded["rol"] == "USER"
    
    def test_decode_expired_token(self):
        """Debe lanzar excepción para token expirado"""
        payload = {
            "id": 1,
            "username": "test@example.com",
            "rol": "USER",
            "exp": datetime.now(timezone.utc) - timedelta(hours=1)
        }
        token = jwt.encode(payload, DECODED_KEY, algorithm=ALGORITHM)
        
        with pytest.raises(HTTPException) as exc:
            decode_jwt(token)
        assert exc.value.status_code == 401
        assert "expired" in exc.value.detail.lower()
    
    def test_decode_invalid_token(self):
        """Debe lanzar excepción para token inválido"""
        with pytest.raises(HTTPException) as exc:
            decode_jwt("invalid_token")
        assert exc.value.status_code == 401
        assert "invalid" in exc.value.detail.lower()
    
    def test_decode_empty_token(self):
        """Debe lanzar excepción para token vacío"""
        with pytest.raises(HTTPException) as exc:
            decode_jwt("")
        assert exc.value.status_code == 401


class TestGetCurrentUser:
    """Pruebas de obtención de usuario actual"""
    
    def test_get_existing_user(self, db_session, sample_user, create_token):
        """Debe obtener usuario existente desde token"""
        from fastapi.security import HTTPAuthorizationCredentials
        
        token = create_token(sample_user.email, user_id=sample_user.auth_id)
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials=token
        )
        
        user = get_current_user(credentials, db_session)
        assert user.email == sample_user.email
        assert user.user_id == sample_user.user_id
    
    def test_create_user_if_not_exists(self, db_session, create_token):
        """Debe crear usuario si no existe en la base de datos"""
        from fastapi.security import HTTPAuthorizationCredentials
        
        new_email = "newuser@library.com"
        token = create_token(new_email, user_id=999)
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials=token
        )
        
        user = get_current_user(credentials, db_session)
        assert user.email == new_email
        assert user.status == "active"
        assert user.full_name == "newuser"
    
    def test_missing_username_in_token(self, db_session):
        """Debe lanzar excepción si falta username en token"""
        from fastapi.security import HTTPAuthorizationCredentials
        
        payload = {
            "id": 1,
            "rol": "USER",
            "exp": datetime.now(timezone.utc) + timedelta(hours=1)
        }
        token = jwt.encode(payload, DECODED_KEY, algorithm=ALGORITHM)
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials=token
        )
        
        with pytest.raises(HTTPException) as exc:
            get_current_user(credentials, db_session)
        assert exc.value.status_code == 400


class TestGetCurrentLibrarian:
    """Pruebas de verificación de rol de bibliotecario"""
    
    def test_valid_admin_access(self, db_session, sample_user, admin_token):
        """Debe permitir acceso a usuarios con rol ADMIN"""
        from fastapi.security import HTTPAuthorizationCredentials
        
        # Actualizar email del sample_user para que coincida con el token
        sample_user.email = "admin@library.com"
        db_session.commit()
        
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials=admin_token
        )
        
        user = get_current_librarian(credentials, db_session)
        assert user is not None
    
    def test_non_admin_access_denied(self, db_session, user_token):
        """Debe denegar acceso a usuarios sin rol ADMIN"""
        from fastapi.security import HTTPAuthorizationCredentials
        
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials=user_token
        )
        
        with pytest.raises(HTTPException) as exc:
            get_current_librarian(credentials, db_session)
        assert exc.value.status_code == 403
        assert "admin" in exc.value.detail.lower()
    
    def test_admin_user_not_found(self, db_session, admin_token):
        """Debe lanzar excepción si usuario admin no existe"""
        from fastapi.security import HTTPAuthorizationCredentials
        
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials=admin_token
        )
        
        with pytest.raises(HTTPException) as exc:
            get_current_librarian(credentials, db_session)
        assert exc.value.status_code == 404