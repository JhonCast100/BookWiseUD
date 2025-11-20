# tests/conftest.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from app.database import Base, get_db
from app.main import app
import jwt
import base64
from datetime import datetime, timedelta

# Base de datos de prueba en memoria
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Configuración de JWT para tests
SECRET_KEY = "MTkxNTYyMDIzMTE4NTUxNDc5MTQ1NTE4OTE0NzE5NTEzOTE0MTE4"
ALGORITHM = "HS256"
DECODED_KEY = base64.b64decode(SECRET_KEY)


@pytest.fixture(scope="function")
def db_session():
    """Crea una sesión de base de datos limpia para cada test"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Cliente de prueba de FastAPI con base de datos mockeada"""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def create_token():
    """Factory para crear tokens JWT de prueba"""
    def _create_token(username: str, user_id: int = 1, rol: str = "USER"):
        payload = {
            "id": user_id,
            "username": username,
            "rol": rol,
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        return jwt.encode(payload, DECODED_KEY, algorithm=ALGORITHM)
    return _create_token


@pytest.fixture
def admin_token(create_token):
    """Token de administrador para pruebas"""
    return create_token("admin@library.com", user_id=999, rol="ADMIN")


@pytest.fixture
def user_token(create_token):
    """Token de usuario regular para pruebas"""
    return create_token("user@library.com", user_id=1, rol="USER")


@pytest.fixture
def auth_headers(user_token):
    """Headers con autenticación de usuario regular"""
    return {"Authorization": f"Bearer {user_token}"}


@pytest.fixture
def admin_headers(admin_token):
    """Headers con autenticación de administrador"""
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture
def sample_category(db_session):
    """Crea una categoría de ejemplo"""
    from app.models.category import Category
    category = Category(name="Fiction", description="Fiction books")
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)
    return category


@pytest.fixture
def sample_book(db_session, sample_category):
    """Crea un libro de ejemplo"""
    from app.models.book import Book
    book = Book(
        title="1984",
        author="George Orwell",
        publication_year=1949,
        isbn="978-0451524935",
        status="available",
        category_id=sample_category.category_id
    )
    db_session.add(book)
    db_session.commit()
    db_session.refresh(book)
    return book


@pytest.fixture
def sample_user(db_session):
    """Crea un usuario de ejemplo"""
    from app.models.user import User
    user = User(
        auth_id=1,
        full_name="John Doe",
        email="user@library.com",
        phone="1234567890",
        status="active"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def sample_loan(db_session, sample_book, sample_user):
    """Crea un préstamo de ejemplo"""
    from app.models.loan import Loan
    from datetime import date
    
    loan = Loan(
        book_id=sample_book.book_id,
        user_id=sample_user.user_id,
        loan_date=date.today(),
        status="active"
    )
    sample_book.status = "loaned"
    db_session.add(loan)
    db_session.commit()
    db_session.refresh(loan)
    return loan