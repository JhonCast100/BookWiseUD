from sqlalchemy.orm import Session
from app import models, schemas

def get_books(db: Session):
    return db.query(models.Book).all()

def get_available_books(db: Session):
    return db.query(models.Book).filter(models.Book.status == "available").all()

def get_books_by_filter(db: Session, search: str):
    search_term = f"%{search.lower()}%"
    return db.query(models.Book).join(models.Category).filter(
        (models.Book.title.ilike(search_term)) |
        (models.Book.author.ilike(search_term)) |
        (models.Category.name.ilike(search_term))
    ).all()

def get_book_by_id(db: Session, book_id: int):
    return db.query(models.Book).filter(models.Book.book_id == book_id).first()

def create_book(db: Session, book: schemas.BookCreate):
    db_book = models.Book(
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
    for key, value in book_update.dict().items():
        setattr(book, key, value)
    db.commit()
    db.refresh(book)
    return book

def delete_book(db: Session, book_id: int):
    book = get_book_by_id(db, book_id)
    if book:
        db.delete(book)
        db.commit()
    return book
