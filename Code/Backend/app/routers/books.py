from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.crud import books as crud_books
from app.database import get_db

router = APIRouter(prefix="/books", tags=["Books"])

@router.get("/", response_model=list[schemas.Book])
def get_all_books(db: Session = Depends(get_db)):
    return crud_books.get_books(db)

@router.get("/available", response_model=list[schemas.Book])
def get_available_books(db: Session = Depends(get_db)):
    return crud_books.get_available_books(db)

@router.get("/search", response_model=list[schemas.Book])
def search_books(search: str, db: Session = Depends(get_db)):
    return crud_books.get_books_by_filter(db, search)

@router.post("/", response_model=schemas.Book)
def create_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    return crud_books.create_book(db, book)

@router.put("/{book_id}", response_model=schemas.Book)
def update_book(book_id: int, book: schemas.BookCreate, db: Session = Depends(get_db)):
    updated_book = crud_books.update_book(db, book_id, book)
    if not updated_book:
        raise HTTPException(status_code=404, detail="Book not found")
    return updated_book

@router.delete("/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = crud_books.delete_book(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return {"message": "Book deleted successfully"}
