# tests/test_loans.py
import pytest
from datetime import date
from app.crud import loans as crud_loans
from app.schemas import LoanCreate


class TestLoanCRUD:
    """Pruebas de operaciones CRUD de préstamos"""
    
    def test_get_all_loans(self, db_session, sample_loan):
        """Debe obtener todos los préstamos"""
        loans = crud_loans.get_loans(db_session)
        assert len(loans) == 1
        assert loans[0].loan_id == sample_loan.loan_id
    
    def test_get_active_loans(self, db_session, sample_loan):
        """Debe obtener solo préstamos activos"""
        active_loans = crud_loans.get_active_loans(db_session)
        assert len(active_loans) == 1
        assert active_loans[0].status == "active"
    
    def test_create_loan_with_available_book(self, db_session, sample_category):
        """Debe crear préstamo cuando el libro está disponible"""
        from app.models.book import Book
        from app.models.user import User
        
        # Crear libro disponible
        book = Book(
            title="Available Book",
            author="Author",
            isbn="ISBN-123",
            status="available",
            category_id=sample_category.category_id
        )
        db_session.add(book)
        
        # Crear usuario
        user = User(
            auth_id=10,
            full_name="Test User",
            email="testuser@library.com",
            status="active"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(book)
        db_session.refresh(user)
        
        # Crear préstamo
        loan_data = LoanCreate(
            book_id=book.book_id,
            user_id=user.user_id,
            loan_date=date.today()
        )
        
        loan = crud_loans.create_loan(db_session, loan_data)
        assert loan is not None
        assert loan.status == "active"
        assert loan.book_id == book.book_id
        assert loan.user_id == user.user_id
        
        # Verificar que el libro cambió a estado "loaned"
        db_session.refresh(book)
        assert book.status == "loaned"
    
    def test_create_loan_with_unavailable_book(self, db_session, sample_book, sample_user):
        """Debe fallar al crear préstamo si el libro no está disponible"""
        sample_book.status = "loaned"
        db_session.commit()
        
        loan_data = LoanCreate(
            book_id=sample_book.book_id,
            user_id=sample_user.user_id,
            loan_date=date.today()
        )
        
        loan = crud_loans.create_loan(db_session, loan_data)
        assert loan is None
    
    def test_create_loan_with_nonexistent_book(self, db_session, sample_user):
        """Debe fallar al crear préstamo con libro inexistente"""
        loan_data = LoanCreate(
            book_id=9999,
            user_id=sample_user.user_id,
            loan_date=date.today()
        )
        
        loan = crud_loans.create_loan(db_session, loan_data)
        assert loan is None
    
    def test_return_loan(self, db_session, sample_loan, sample_book):
        """Debe marcar préstamo como devuelto"""
        returned = crud_loans.return_loan(db_session, sample_loan.loan_id)
        
        assert returned is not None
        assert returned.status == "returned"
        assert returned.return_date == date.today()
        
        # Verificar que el libro vuelve a estar disponible
        db_session.refresh(sample_book)
        assert sample_book.status == "available"
    
    def test_return_nonexistent_loan(self, db_session):
        """Debe retornar None al devolver préstamo inexistente"""
        result = crud_loans.return_loan(db_session, 9999)
        assert result is None
    
    def test_return_already_returned_loan(self, db_session, sample_loan):
        """Debe retornar None al devolver préstamo ya devuelto"""
        sample_loan.status = "returned"
        db_session.commit()
        
        result = crud_loans.return_loan(db_session, sample_loan.loan_id)
        assert result is None
    
    def test_delete_loan(self, db_session, sample_loan):
        """Debe eliminar un préstamo"""
        deleted = crud_loans.delete_loan(db_session, sample_loan.loan_id)
        assert deleted is not None
        
        # Verificar que fue eliminado
        loan = db_session.query(crud_loans.Loan).filter(
            crud_loans.Loan.loan_id == sample_loan.loan_id
        ).first()
        assert loan is None


class TestLoanEndpoints:
    """Pruebas de endpoints de préstamos"""
    
    def test_get_all_loans_requires_admin(self, client, sample_loan, user_token):
        """GET /loans/ debe requerir rol de admin"""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.get("/loans/", headers=headers)
        assert response.status_code == 403
    
    def test_get_all_loans_with_admin(self, client, sample_loan, admin_headers, admin_user):
        """GET /loans/ debe funcionar con admin"""
        response = client.get("/loans/", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
    
    def test_get_my_loans(self, client, sample_loan, sample_user, auth_headers):
        """GET /loans/me debe retornar préstamos del usuario autenticado"""
        response = client.get("/loans/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_my_loans_requires_auth(self, client):
        """GET /loans/me debe requerir autenticación"""
        response = client.get("/loans/me")
        assert response.status_code == 403
    
    def test_get_active_loans_requires_admin(self, client, user_token):
        """GET /loans/active debe requerir rol de admin"""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.get("/loans/active", headers=headers)
        assert response.status_code == 403
    
    def test_get_active_loans_with_admin(self, client, sample_loan, admin_headers, admin_user):
        """GET /loans/active debe funcionar con admin"""
        response = client.get("/loans/active", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert all(loan["status"] == "active" for loan in data)
    
    def test_create_loan_requires_admin(self, client, sample_book, sample_user, user_token):
        """POST /loans/ debe requerir rol de admin"""
        headers = {"Authorization": f"Bearer {user_token}"}
        loan_data = {
            "book_id": sample_book.book_id,
            "user_id": sample_user.user_id,
            "loan_date": str(date.today())
        }
        
        response = client.post("/loans/", json=loan_data, headers=headers)
        assert response.status_code == 403
    
    def test_create_loan_with_admin(self, client, db_session, sample_category, admin_headers, admin_user):
        """POST /loans/ debe funcionar con admin"""
        from app.models.book import Book
        from app.models.user import User
        
        # Crear libro directamente en db_session
        book = Book(
            title="Loan Test Book",
            author="Test Author",
            isbn="ISBN-TEST",
            status="available",
            category_id=sample_category.category_id
        )
        db_session.add(book)
        
        # Crear usuario directamente en db_session
        user = User(
            auth_id=50,
            full_name="Loan Test User",
            email="loantest@library.com",
            status="active"
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(book)
        db_session.refresh(user)
        
        # Crear préstamo
        loan_data = {
            "book_id": book.book_id,
            "user_id": user.user_id,
            "loan_date": str(date.today())
        }
        
        response = client.post("/loans/", json=loan_data, headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["book_id"] == book.book_id
        assert data["user_id"] == user.user_id
        assert data["status"] == "active"
    
    def test_create_loan_user_not_found(self, client, sample_book, admin_headers, admin_user):
        """POST /loans/ debe retornar 404 si usuario no existe"""
        loan_data = {
            "book_id": sample_book.book_id,
            "user_id": 9999,
            "loan_date": str(date.today())
        }
        
        response = client.post("/loans/", json=loan_data, headers=admin_headers)
        assert response.status_code == 404
    
    def test_create_loan_book_not_found(self, client, sample_user, admin_headers, admin_user):
        """POST /loans/ debe retornar 404 si libro no existe"""
        loan_data = {
            "book_id": 9999,
            "user_id": sample_user.user_id,
            "loan_date": str(date.today())
        }
        
        response = client.post("/loans/", json=loan_data, headers=admin_headers)
        assert response.status_code == 404
    
    def test_create_loan_book_not_available(self, client, sample_loan, admin_headers, admin_user):
        """POST /loans/ debe retornar 400 si libro no está disponible"""
        loan_data = {
            "book_id": sample_loan.book_id,
            "user_id": sample_loan.user_id,
            "loan_date": str(date.today())
        }
        
        response = client.post("/loans/", json=loan_data, headers=admin_headers)
        assert response.status_code == 400
    
    def test_return_loan_requires_admin(self, client, sample_loan, user_token):
        """PUT /loans/return/{id} debe requerir rol de admin"""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.put(f"/loans/return/{sample_loan.loan_id}", headers=headers)
        assert response.status_code == 403
    
    def test_return_loan_with_admin(self, client, sample_loan, admin_headers, admin_user):
        """PUT /loans/return/{id} debe funcionar con admin"""
        response = client.put(f"/loans/return/{sample_loan.loan_id}", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "returned"
        assert data["return_date"] is not None
    
    def test_return_loan_not_found(self, client, admin_headers, admin_user):
        """PUT /loans/return/{id} debe retornar 404 si préstamo no existe"""
        response = client.put("/loans/return/9999", headers=admin_headers)
        assert response.status_code == 404
    
    def test_delete_loan_requires_admin(self, client, sample_loan, user_token):
        """DELETE /loans/{id} debe requerir rol de admin"""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.delete(f"/loans/{sample_loan.loan_id}", headers=headers)
        assert response.status_code == 403