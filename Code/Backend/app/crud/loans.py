from sqlalchemy.orm import Session
from datetime import date
from app import models, schemas

def get_loans(db: Session):
    return db.query(models.Loan).all()

def get_active_loans(db: Session):
    return db.query(models.Loan).filter(models.Loan.status == "active").all()

def create_loan(db: Session, loan: schemas.LoanCreate):
    book = db.query(models.Book).filter(models.Book.book_id == loan.book_id).first()
    if not book or book.status != "available":
        return None  # Book not available
    
    db_loan = models.Loan(
        book_id=loan.book_id,
        user_id=loan.user_id,
        loan_date=loan.loan_date or date.today(),
        return_date=loan.return_date,
        status="active"
    )
    db.add(db_loan)
    book.status = "loaned"
    db.commit()
    db.refresh(db_loan)
    return db_loan

def return_loan(db: Session, loan_id: int):
    loan = db.query(models.Loan).filter(models.Loan.loan_id == loan_id).first()
    if not loan or loan.status != "active":
        return None
    loan.status = "returned"
    loan.return_date = date.today()

    book = db.query(models.Book).filter(models.Book.book_id == loan.book_id).first()
    book.status = "available"

    db.commit()
    db.refresh(loan)
    return loan

def delete_loan(db: Session, loan_id: int):
    loan = db.query(models.Loan).filter(models.Loan.loan_id == loan_id).first()
    if loan:
        db.delete(loan)
        db.commit()
    return loan
