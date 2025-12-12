# tests/test_users.py
import pytest
from app.crud import users as crud_users
from app.schemas import UserCreate


class TestUserCRUD:
    """Pruebas de operaciones CRUD de usuarios"""
    
    def test_get_all_users(self, db_session, sample_user):
        """Debe obtener todos los usuarios"""
        users = crud_users.get_users(db_session)
        assert len(users) == 1
        assert users[0].email == sample_user.email
    
    def test_get_user_by_id(self, db_session, sample_user):
        """Debe obtener usuario por ID"""
        user = crud_users.get_user_by_id(db_session, sample_user.user_id)
        assert user is not None
        assert user.user_id == sample_user.user_id
    
    def test_get_user_by_id_not_found(self, db_session):
        """Debe retornar None si usuario no existe"""
        user = crud_users.get_user_by_id(db_session, 9999)
        assert user is None
    
    def test_get_user_by_email(self, db_session, sample_user):
        """Debe obtener usuario por email"""
        user = crud_users.get_user_by_email(db_session, sample_user.email)
        assert user is not None
        assert user.email == sample_user.email
    
    def test_get_user_by_auth_id(self, db_session, sample_user):
        """Debe obtener usuario por auth_id"""
        user = crud_users.get_user_by_auth_id(db_session, sample_user.auth_id)
        assert user is not None
        assert user.auth_id == sample_user.auth_id
    
    def test_create_user(self, db_session):
        """Debe crear un nuevo usuario"""
        user_data = UserCreate(
            auth_id=2,
            full_name="Jane Doe",
            email="jane@library.com",
            phone="9876543210",
            status="active"
        )
        
        user = crud_users.create_user(db_session, user_data)
        assert user.user_id is not None
        assert user.email == "jane@library.com"
        assert user.status == "active"
    
    def test_create_user_duplicate_email(self, db_session, sample_user):
        """Debe lanzar error al crear usuario con email duplicado"""
        user_data = UserCreate(
            auth_id=2,
            full_name="Another User",
            email=sample_user.email,
            phone="9999999999",
            status="active"
        )
        
        with pytest.raises(ValueError) as exc:
            crud_users.create_user(db_session, user_data)
        assert "email already registered" in str(exc.value).lower()
    
    def test_create_user_duplicate_auth_id(self, db_session, sample_user):
        """Debe lanzar error al crear usuario con auth_id duplicado"""
        user_data = UserCreate(
            auth_id=sample_user.auth_id,
            full_name="Another User",
            email="another@library.com",
            phone="9999999999",
            status="active"
        )
        
        with pytest.raises(ValueError) as exc:
            crud_users.create_user(db_session, user_data)
        assert "auth id already registered" in str(exc.value).lower()
    
    def test_update_user(self, db_session, sample_user):
        """Debe actualizar un usuario existente"""
        update_data = UserCreate(
            auth_id=sample_user.auth_id,
            full_name="Updated Name",
            email=sample_user.email,
            phone="1111111111",
            status="active"
        )
        
        updated = crud_users.update_user(db_session, sample_user.user_id, update_data)
        assert updated.full_name == "Updated Name"
        assert updated.phone == "1111111111"
    
    def test_update_user_email(self, db_session, sample_user):
        """Debe permitir actualizar email si no está en uso"""
        update_data = UserCreate(
            auth_id=sample_user.auth_id,
            full_name=sample_user.full_name,
            email="newemail@library.com",
            phone=sample_user.phone,
            status="active"
        )
        
        updated = crud_users.update_user(db_session, sample_user.user_id, update_data)
        assert updated.email == "newemail@library.com"
    
    def test_update_user_duplicate_email(self, db_session, sample_user):
        """Debe lanzar error al actualizar con email ya existente"""
        from app.models.user import User
        
        # Crear segundo usuario
        user2 = User(
            auth_id=2,
            full_name="User 2",
            email="user2@library.com",
            status="active"
        )
        db_session.add(user2)
        db_session.commit()
        
        # Intentar actualizar user2 con email de sample_user
        update_data = UserCreate(
            auth_id=user2.auth_id,
            full_name=user2.full_name,
            email=sample_user.email,
            phone=user2.phone,
            status="active"
        )
        
        with pytest.raises(ValueError) as exc:
            crud_users.update_user(db_session, user2.user_id, update_data)
        assert "email already registered" in str(exc.value).lower()
    
    def test_update_nonexistent_user(self, db_session):
        """Debe retornar None al actualizar usuario inexistente"""
        update_data = UserCreate(
            auth_id=999,
            full_name="Test",
            email="test@test.com",
            phone="1234567890",
            status="active"
        )
        
        result = crud_users.update_user(db_session, 9999, update_data)
        assert result is None
    
    def test_delete_user(self, db_session, sample_user):
        """Debe eliminar un usuario"""
        deleted = crud_users.delete_user(db_session, sample_user.user_id)
        assert deleted.status == "inactive"
        


class TestUserEndpoints:
    """Pruebas de endpoints de usuarios"""
    
    def test_get_users_requires_admin(self, client, user_token):
        """GET /users/ debe requerir rol de admin"""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.get("/users/", headers=headers)
        assert response.status_code == 403
    
    def test_get_users_with_admin(self, client, admin_headers, sample_user, admin_user):
        """GET /users/ debe funcionar con admin"""
        response = client.get("/users/", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
    
    def test_get_user_by_id_requires_admin(self, client, sample_user, user_token):
        """GET /users/{id} debe requerir rol de admin"""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.get(f"/users/{sample_user.user_id}", headers=headers)
        assert response.status_code == 403
    
    def test_get_user_by_id_not_found(self, client, admin_headers, admin_user):
        """GET /users/{id} debe retornar 404 si no existe"""
        response = client.get("/users/9999", headers=admin_headers)
        assert response.status_code == 404
    
    def test_create_user_requires_admin(self, client, user_token):
        """POST /users/ debe requerir rol de admin"""
        headers = {"Authorization": f"Bearer {user_token}"}
        user_data = {
            "auth_id": 5,
            "full_name": "New User",
            "email": "new@library.com",
            "phone": "5555555555",
            "status": "active"
        }
        
        response = client.post("/users/", json=user_data, headers=headers)
        assert response.status_code == 403
    
    def test_create_user_with_admin(self, client, admin_headers, admin_user):
        """POST /users/ debe funcionar con admin"""
        user_data = {
            "auth_id": 5,
            "full_name": "New User",
            "email": "new@library.com",
            "phone": "5555555555",
            "status": "active"
        }
        
        response = client.post("/users/", json=user_data, headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "new@library.com"
    
    def test_update_user_requires_admin(self, client, sample_user, user_token):
        """PUT /users/{id} debe requerir rol de admin"""
        headers = {"Authorization": f"Bearer {user_token}"}
        user_data = {
            "auth_id": sample_user.auth_id,
            "full_name": "Updated",
            "email": sample_user.email,
            "phone": "1234567890",
            "status": "active"
        }
        
        response = client.put(
            f"/users/{sample_user.user_id}",
            json=user_data,
            headers=headers
        )
        assert response.status_code == 403
    
    def test_delete_user_requires_admin(self, client, sample_user, user_token):
        """DELETE /users/{id} debe requerir rol de admin"""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.delete(f"/users/{sample_user.user_id}", headers=headers)
        assert response.status_code == 403