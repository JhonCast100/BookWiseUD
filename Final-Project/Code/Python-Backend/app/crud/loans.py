from sqlalchemy.orm import Session
from datetime import date
from app.models.loan import Loan
from app.models.book import Book
from app import schemas

def get_loans(db: Session):
    """Obtener todos los préstamos"""
    return db.query(Loan).all()

def get_active_loans(db: Session):
    """Obtener préstamos activos"""
    return db.query(Loan).filter(Loan.status == "active").all()

def create_loan(db: Session, loan: schemas.LoanCreate):
    """Crear un préstamo si el libro está disponible"""
    book = db.query(Book).filter(Book.book_id == loan.book_id).first()
    if not book or book.status != "available":
        return None  # Libro no disponible
    
    db_loan = Loan(
        book_id=loan.book_id,
        user_id=loan.user_id,
        loan_date=loan.loan_date or date.today(),
        status="active"
    )
    db.add(db_loan)
    book.status = "loaned"
    db.commit()
    db.refresh(db_loan)
    return db_loan

def return_loan(db: Session, loan_id: int):
    """Marcar préstamo como devuelto"""
    loan = db.query(Loan).filter(Loan.loan_id == loan_id).first()
    if not loan or loan.status != "active":
        return None

    loan.status = "returned"
    loan.return_date = date.today()

    # Cambiar estado del libro a disponible
    book = db.query(Book).filter(Book.book_id == loan.book_id).first()
    if book:
        book.status = "available"

    db.commit()
    db.refresh(loan)
    return loan

def delete_loan(db: Session, loan_id: int):
    """Eliminar préstamo"""
    loan = db.query(Loan).filter(Loan.loan_id == loan_id).first()
    if loan:
        db.delete(loan)
        db.commit()
    return loan