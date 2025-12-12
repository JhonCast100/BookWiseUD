from sqlalchemy.orm import Session
from app.models.book import Book
from app.models.category import Category
from app import schemas

def get_books(db: Session):
    return db.query(Book).all()

def get_available_books(db: Session):
    return db.query(Book).filter(Book.status == "available").all()

def get_books_by_filter(db: Session, search: str):
    search_term = f"%{search.lower()}%"
    return db.query(Book).join(Category).filter(
        (Book.title.ilike(search_term)) |
        (Book.author.ilike(search_term)) |
        (Category.name.ilike(search_term))
    ).all()

def get_book_by_id(db: Session, book_id: int):
    return db.query(Book).filter(Book.book_id == book_id).first()

def create_book(db: Session, book: schemas.BookCreate):
    db_book = Book(
        title=book.title,
        author=book.author,
        publication_year=book.publication_year,
        isbn=book.isbn,
        category_id=book.category_id,
        status=book.status
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def update_book(db: Session, book_id: int, book_update: schemas.BookCreate):
    book = get_book_by_id(db, book_id)
    if not book:
        return None
    for key, value in book_update.model_dump().items():
        setattr(book, key, value)
    db.commit()
    db.refresh(book)
    return book

def delete_book(db: Session, book_id: int):
    book = get_book_by_id(db, book_id)
    if book:
        book.status = "inactive"
        db.commit()
        db.refresh(book)
    return book
