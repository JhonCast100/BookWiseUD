from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.crud import loans as crud_loans
from app.database import get_db

router = APIRouter(prefix="/loans", tags=["Loans"])

@router.get("/", response_model=list[schemas.Loan])
def get_all_loans(db: Session = Depends(get_db)):
    return crud_loans.get_loans(db)

@router.get("/active", response_model=list[schemas.Loan])
def get_active_loans(db: Session = Depends(get_db)):
    return crud_loans.get_active_loans(db)

@router.post("/", response_model=schemas.Loan)
def create_loan(loan: schemas.LoanCreate, db: Session = Depends(get_db)):
    new_loan = crud_loans.create_loan(db, loan)
    if not new_loan:
        raise HTTPException(status_code=400, detail="Book not available or invalid")
    return new_loan

@router.put("/return/{loan_id}", response_model=schemas.Loan)
def return_loan(loan_id: int, db: Session = Depends(get_db)):
    returned = crud_loans.return_loan(db, loan_id)
    if not returned:
        raise HTTPException(status_code=404, detail="Loan not found or already returned")
    return returned

@router.delete("/{loan_id}")
def delete_loan(loan_id: int, db: Session = Depends(get_db)):
    loan = crud_loans.delete_loan(db, loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return {"message": "Loan deleted successfully"}
