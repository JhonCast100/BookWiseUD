from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.auth_utils import get_current_user

router = APIRouter(prefix="/loans", tags=["Loans"])


@router.get("/", response_model=list[schemas.Loan])
def get_all_loans(db: Session = Depends(get_db)):
    return db.query(models.Loan).all()


@router.post("/", response_model=schemas.Loan)
def create_loan(loan: schemas.LoanCreate, 
                db: Session = Depends(get_db),
                current_user: models.User = Depends(get_current_user)):
    """
    Crea un préstamo asociado al usuario autenticado.
    """
    new_loan = models.Loan(
        book_id=loan.book_id,
        user_id=current_user.user_id,  # relación interna en PostgreSQL
        loan_date=loan.loan_date,
        return_date=loan.return_date,
        status="active"
    )
    db.add(new_loan)
    db.commit()
    db.refresh(new_loan)
    return new_loan


@router.get("/me", response_model=list[schemas.Loan])
def get_my_loans(db: Session = Depends(get_db),
                 current_user: models.User = Depends(get_current_user)):
    """
    Retorna todos los préstamos del usuario autenticado.
    """
    return db.query(models.Loan).filter(models.Loan.user_id == current_user.user_id).all()
