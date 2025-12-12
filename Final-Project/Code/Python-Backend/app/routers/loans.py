# app/routers/loans.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.user import User  # ✅ Importación explícita
from app.models.book import Book  # ✅ Importación explícita
from app.models.loan import Loan  # ✅ Importación explícita
from app import schemas
from app.auth_utils import get_current_user, get_current_librarian

router = APIRouter(prefix="/loans", tags=["Loans"])


@router.get("/", response_model=list[schemas.Loan])
def get_all_loans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_librarian)
):
    """Obtiene todos los préstamos (solo bibliotecarios)."""
    return db.query(Loan).all()


@router.get("/me", response_model=list[schemas.Loan])
def get_my_loans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtiene los préstamos del usuario autenticado."""
    return db.query(Loan)\
        .filter(Loan.user_id == current_user.user_id)\
        .all()


@router.get("/active", response_model=list[schemas.Loan])
def get_active_loans(
    db: Session = Depends(get_db)
):
    """Obtiene todos los préstamos activos."""
    return db.query(Loan)\
        .filter(Loan.status == "active")\
        .all()


@router.post("/", response_model=schemas.Loan)
def create_loan(
    loan: schemas.LoanCreate, 
    db: Session = Depends(get_db)
):
    """
    Crea un préstamo para cualquier usuario.
    El user_id viene en el body del request.
    """
    # ✅ Verificar que el usuario objetivo existe y está activo
    target_user = db.query(User).filter(User.user_id == loan.user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if target_user.status != "active":
        raise HTTPException(status_code=400, detail="User is not active")
    
    # Verificar que el libro existe y está disponible
    book = db.query(Book).filter(Book.book_id == loan.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    if book.status != "available":
        raise HTTPException(status_code=400, detail="Book is not available")
    
    # ✅ Crear el préstamo con el user_id del body (usuario seleccionado)
    new_loan = Loan(
        book_id=loan.book_id,
        user_id=loan.user_id,  # ✅ Usar el user_id del body
        loan_date=loan.loan_date or datetime.now().date(),
        status="active"
    )
    
    # Cambiar el estado del libro a "loaned"
    book.status = "loaned"
    
    db.add(new_loan)
    db.commit()
    db.refresh(new_loan)
    
    return new_loan


@router.put("/return/{loan_id}", response_model=schemas.Loan)
def return_loan(
    loan_id: int,
    db: Session = Depends(get_db)
):
    """Marca un préstamo como devuelto."""
    loan = db.query(Loan).filter(Loan.loan_id == loan_id).first()
    
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    if loan.status == "returned":
        raise HTTPException(status_code=400, detail="Loan already returned")
    
    loan.return_date = datetime.now().date()
    loan.status = "returned"
    
    book = db.query(Book).filter(Book.book_id == loan.book_id).first()
    if book:
        book.status = "available"
    
    db.commit()
    db.refresh(loan)
    
    return loan


@router.get("/{loan_id}", response_model=schemas.Loan)
def get_loan(
    loan_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtiene un préstamo específico.
    """
    loan = db.query(Loan).filter(Loan.loan_id == loan_id).first()
    
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    return loan


@router.delete("/{loan_id}")
def delete_loan(
    loan_id: int,
    db: Session = Depends(get_db)
):
    """Elimina un préstamo."""
    loan = db.query(Loan).filter(Loan.loan_id == loan_id).first()
    
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    if loan.status == "active":
        book = db.query(Book).filter(Book.book_id == loan.book_id).first()
        if book:
            book.status = "available"
    
    db.delete(loan)
    db.commit()
    
    return {"message": "Loan deleted successfully"}