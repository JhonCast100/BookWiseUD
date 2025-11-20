# tests/test_stats_and_categories.py
import pytest
from app.crud import category as crud_category


class TestStatisticsEndpoint:
    """Pruebas del endpoint de estadísticas"""
    
    def test_get_dashboard_stats_requires_auth(self, client):
        """GET /stats/dashboard debe requerir autenticación"""
        response = client.get("/stats/dashboard")
        assert response.status_code == 403
    
    def test_get_dashboard_stats_with_auth(
        self,
        client,
        auth_headers,
        sample_book,
        sample_user,
        sample_loan
    ):
        """GET /stats/dashboard debe retornar estadísticas correctas"""
        response = client.get("/stats/dashboard", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "total_books" in data
        assert "total_users" in data
        assert "active_loans" in data
        assert "available_books" in data
        
        assert data["total_books"] >= 1
        assert data["total_users"] >= 1
        assert data["active_loans"] >= 1
        assert data["available_books"] >= 0
    
    def test_dashboard_stats_empty_database(self, client, auth_headers, sample_user):
        """GET /stats/dashboard debe funcionar con base de datos vacía"""
        response = client.get("/stats/dashboard", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["total_books"] == 0
        assert data["total_users"] >= 1  # Al menos el usuario autenticado
        assert data["active_loans"] == 0
        assert data["available_books"] == 0
    
    def test_dashboard_stats_multiple_books(
        self,
        client,
        auth_headers,
        db_session,
        sample_category,
        sample_user
    ):
        """Las estadísticas deben reflejar múltiples libros correctamente"""
        from app.models.book import Book
        
        # Crear varios libros
        books = [
            Book(
                title=f"Book {i}",
                author=f"Author {i}",
                isbn=f"ISBN-{i}",
                status="available" if i % 2 == 0 else "loaned",
                category_id=sample_category.category_id
            )
            for i in range(5)
        ]
        
        for book in books:
            db_session.add(book)
        db_session.commit()
        
        response = client.get("/stats/dashboard", headers=auth_headers)
        data = response.json()
        
        assert data["total_books"] == 5
        assert data["available_books"] == 3  # Solo los pares (0, 2, 4)
    
    def test_dashboard_stats_returned_loans(
        self,
        client,
        auth_headers,
        db_session,
        sample_loan,
        sample_user
    ):
        """Los préstamos devueltos no deben contarse como activos"""
        sample_loan.status = "returned"
        db_session.commit()
        
        response = client.get("/stats/dashboard", headers=auth_headers)
        data = response.json()
        
        assert data["active_loans"] == 0


class TestCategoryCRUD:
    """Pruebas de operaciones CRUD de categorías"""
    
    def test_get_all_categories(self, db_session, sample_category):
        """Debe obtener todas las categorías"""
        categories = crud_category.get_categories(db_session)
        assert len(categories) == 1
        assert categories[0].name == sample_category.name
    
    def test_get_categories_empty(self, db_session):
        """Debe retornar lista vacía si no hay categorías"""
        categories = crud_category.get_categories(db_session)
        assert len(categories) == 0
    
    def test_get_multiple_categories(self, db_session):
        """Debe obtener múltiples categorías"""
        from app.models.category import Category
        
        categories_data = [
            {"name": "Fiction", "description": "Fiction books"},
            {"name": "Science", "description": "Science books"},
            {"name": "History", "description": "History books"}
        ]
        
        for cat_data in categories_data:
            category = Category(**cat_data)
            db_session.add(category)
        db_session.commit()
        
        categories = crud_category.get_categories(db_session)
        assert len(categories) == 3
        category_names = [cat.name for cat in categories]
        assert "Fiction" in category_names
        assert "Science" in category_names
        assert "History" in category_names


class TestCategoryEndpoints:
    """Pruebas de endpoints de categorías"""
    
    def test_get_all_categories_endpoint(self, client, sample_category):
        """GET /categories/ debe retornar todas las categorías"""
        response = client.get("/categories/")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == sample_category.name
        assert data[0]["category_id"] == sample_category.category_id
    
    def test_get_categories_no_auth_required(self, client, sample_category):
        """GET /categories/ no debe requerir autenticación"""
        response = client.get("/categories/")
        assert response.status_code == 200
    
    def test_get_categories_empty_database(self, client):
        """GET /categories/ debe funcionar con base de datos vacía"""
        response = client.get("/categories/")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data) == 0
    
    def test_categories_response_model(self, client, sample_category):
        """La respuesta debe incluir todos los campos del modelo"""
        response = client.get("/categories/")
        assert response.status_code == 200
        
        data = response.json()[0]
        assert "category_id" in data
        assert "name" in data
        assert "description" in data
        
        assert data["category_id"] == sample_category.category_id
        assert data["name"] == sample_category.name
        assert data["description"] == sample_category.description


class TestIntegrationStats:
    """Pruebas de integración para estadísticas"""
    
    def test_complete_workflow_stats(
        self,
        client,
        admin_headers,
        db_session,
        sample_category,
        admin_user
    ):
        """Probar flujo completo que afecta estadísticas"""
        # Verificar estadísticas iniciales
        response = client.get("/stats/dashboard", headers=admin_headers)
        initial_stats = response.json()
        
        # Crear un libro
        book_data = {
            "title": "Test Book",
            "author": "Test Author",
            "isbn": "TEST-123",
            "status": "available",
            "category_id": sample_category.category_id
        }
        book_response = client.post("/books/", json=book_data)
        book_id = book_response.json()["book_id"]
        
        # Crear un usuario
        user_data = {
            "auth_id": 10,
            "full_name": "Test User",
            "email": "test@test.com",
            "status": "active"
        }
        user_response = client.post("/users/", json=user_data, headers=admin_headers)
        user_id = user_response.json()["user_id"]
        
        # Verificar que aumentaron libros y usuarios
        response = client.get("/stats/dashboard", headers=admin_headers)
        mid_stats = response.json()
        assert mid_stats["total_books"] == initial_stats["total_books"] + 1
        assert mid_stats["total_users"] == initial_stats["total_users"] + 1
        assert mid_stats["available_books"] == initial_stats["available_books"] + 1
        
        # Crear préstamo
        from datetime import date
        loan_data = {
            "book_id": book_id,
            "user_id": user_id,
            "loan_date": str(date.today())
        }
        loan_response = client.post("/loans/", json=loan_data, headers=admin_headers)
        loan_id = loan_response.json()["loan_id"]
        
        # Verificar que aumentaron préstamos activos y disminuyeron disponibles
        response = client.get("/stats/dashboard", headers=admin_headers)
        final_stats = response.json()
        assert final_stats["active_loans"] == mid_stats["active_loans"] + 1
        assert final_stats["available_books"] == mid_stats["available_books"] - 1
        
        # Devolver préstamo
        client.put(f"/loans/return/{loan_id}", headers=admin_headers)
        
        # Verificar que disminuyeron préstamos activos y aumentaron disponibles
        response = client.get("/stats/dashboard", headers=admin_headers)
        returned_stats = response.json()
        assert returned_stats["active_loans"] == final_stats["active_loans"] - 1
        assert returned_stats["available_books"] == final_stats["available_books"] + 1