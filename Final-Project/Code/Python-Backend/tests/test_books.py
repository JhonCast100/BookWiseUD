# tests/test_books.py
import pytest
from app.crud import books as crud_books
from app.schemas import BookCreate


class TestBookCRUD:
    """Pruebas de operaciones CRUD de libros"""
    
    def test_get_all_books(self, db_session, sample_book):
        """Debe obtener todos los libros"""
        books = crud_books.get_books(db_session)
        assert len(books) == 1
        assert books[0].title == sample_book.title
    
    def test_get_available_books(self, db_session, sample_book, sample_category):
        """Debe obtener solo libros disponibles"""
        from app.models.book import Book
        
        # Crear libro prestado
        loaned_book = Book(
            title="Loaned Book",
            author="Author",
            isbn="123-456",
            status="loaned",
            category_id=sample_category.category_id
        )
        db_session.add(loaned_book)
        db_session.commit()
        
        available = crud_books.get_available_books(db_session)
        assert len(available) == 1
        assert available[0].status == "available"
    
    def test_create_book(self, db_session, sample_category):
        """Debe crear un nuevo libro"""
        book_data = BookCreate(
            title="New Book",
            author="New Author",
            publication_year=2024,
            isbn="978-1234567890",
            status="available",
            category_id=sample_category.category_id
        )
        
        book = crud_books.create_book(db_session, book_data)
        assert book.book_id is not None
        assert book.title == "New Book"
        assert book.status == "available"
    
    def test_update_book(self, db_session, sample_book):
        """Debe actualizar un libro existente"""
        update_data = BookCreate(
            title="Updated Title",
            author=sample_book.author,
            publication_year=sample_book.publication_year,
            isbn=sample_book.isbn,
            status="available",
            category_id=sample_book.category_id
        )
        
        updated = crud_books.update_book(db_session, sample_book.book_id, update_data)
        assert updated.title == "Updated Title"
    
    def test_update_nonexistent_book(self, db_session, sample_category):
        """Debe retornar None al actualizar libro inexistente"""
        update_data = BookCreate(
            title="Test",
            author="Test",
            publication_year=2024,
            isbn="123",
            status="available",
            category_id=sample_category.category_id
        )
        
        result = crud_books.update_book(db_session, 9999, update_data)
        assert result is None
    
    def test_delete_book(self, db_session, sample_book):
        """Debe marcar libro como inactivo al eliminar"""
        deleted = crud_books.delete_book(db_session, sample_book.book_id)
        assert deleted.status == "inactive"
    
    def test_get_book_by_id(self, db_session, sample_book):
        """Debe obtener libro por ID"""
        book = crud_books.get_book_by_id(db_session, sample_book.book_id)
        assert book is not None
        assert book.book_id == sample_book.book_id
    
    def test_search_books_by_title(self, db_session, sample_book):
        """Debe buscar libros por título"""
        results = crud_books.get_books_by_filter(db_session, "1984")
        assert len(results) == 1
        assert results[0].title == sample_book.title
    
    def test_search_books_by_author(self, db_session, sample_book):
        """Debe buscar libros por autor"""
        results = crud_books.get_books_by_filter(db_session, "Orwell")
        assert len(results) == 1
        assert results[0].author == sample_book.author
    
    def test_search_books_by_category(self, db_session, sample_book, sample_category):
        """Debe buscar libros por categoría"""
        results = crud_books.get_books_by_filter(db_session, "Fiction")
        assert len(results) == 1
    
    def test_search_books_case_insensitive(self, db_session, sample_book):
        """La búsqueda debe ser case-insensitive"""
        results = crud_books.get_books_by_filter(db_session, "orwell")
        assert len(results) == 1
        
        results = crud_books.get_books_by_filter(db_session, "ORWELL")
        assert len(results) == 1


class TestBookEndpoints:
    """Pruebas de endpoints de libros"""
    
    def test_get_books_endpoint(self, client, sample_book):
        """GET /books/ debe retornar todos los libros"""
        response = client.get("/books/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["title"] == sample_book.title
    
    def test_get_available_books_endpoint(self, client, sample_book):
        """GET /books/available debe retornar solo libros disponibles"""
        response = client.get("/books/available")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["status"] == "available"
    
    def test_search_books_endpoint(self, client, sample_book):
        """GET /books/search debe buscar libros"""
        response = client.get("/books/search?search=1984")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
    
    def test_create_book_endpoint(self, client, db_session, sample_category):
        """POST /books/ debe crear un libro"""
        book_data = {
            "title": "Test Book",
            "author": "Test Author",
            "publication_year": 2024,
            "isbn": "978-9999999999",
            "status": "available",
            "category_id": sample_category.category_id
        }
        
        response = client.post("/books/", json=book_data)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Test Book"
        assert "book_id" in data
    
    def test_update_book_endpoint(self, client, sample_book):
        """PUT /books/{id} debe actualizar un libro"""
        update_data = {
            "title": "Updated Book",
            "author": sample_book.author,
            "publication_year": sample_book.publication_year,
            "isbn": sample_book.isbn,
            "status": "available",
            "category_id": sample_book.category_id
        }
        
        response = client.put(f"/books/{sample_book.book_id}", json=update_data)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Book"
    
    def test_update_nonexistent_book_endpoint(self, client, sample_category):
        """PUT /books/{id} debe retornar 404 para libro inexistente"""
        update_data = {
            "title": "Test",
            "author": "Test",
            "publication_year": 2024,
            "isbn": "123",
            "status": "available",
            "category_id": sample_category.category_id
        }
        
        response = client.put("/books/9999", json=update_data)
        assert response.status_code == 404
    
    def test_delete_book_endpoint(self, client, sample_book):
        """DELETE /books/{id} debe eliminar un libro"""
        response = client.delete(f"/books/{sample_book.book_id}")
        assert response.status_code == 200
        
        # Verificar que el libro está marcado como inactivo
        get_response = client.get(f"/books/")
        books = get_response.json()
        deleted_book = next(b for b in books if b["book_id"] == sample_book.book_id)
        assert deleted_book["status"] == "inactive"
    
    def test_delete_nonexistent_book_endpoint(self, client):
        """DELETE /books/{id} debe retornar 404 para libro inexistente"""
        response = client.delete("/books/9999")
        assert response.status_code == 404