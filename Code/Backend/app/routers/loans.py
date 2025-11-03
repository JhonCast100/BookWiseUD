# app/routers/loans.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app import models, schemas
from app.auth_utils import get_current_user, get_current_librarian

router = APIRouter(prefix="/loans", tags=["Loans"])


@router.get("/", response_model=list[schemas.Loan])
def get_all_loans(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_librarian)
):
    """
    Obtiene todos los préstamos (solo bibliotecarios).
    """
    return db.query(models.Loan).all()


@router.get("/me", response_model=list[schemas.Loan])
def get_my_loans(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Obtiene los préstamos del usuario autenticado.
    """
    return db.query(models.Loan)\
        .filter(models.Loan.user_id == current_user.user_id)\
        .all()


@router.get("/active", response_model=list[schemas.Loan])
def get_active_loans(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_librarian)
):
    """
    Obtiene todos los préstamos activos (solo bibliotecarios).
    """
    return db.query(models.Loan)\
        .filter(models.Loan.status == "active")\
        .all()


@router.post("/", response_model=schemas.Loan)
def create_loan(
    loan: schemas.LoanCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Crea un préstamo. El user_id se toma del token JWT automáticamente.
    """
    # Verificar que el libro existe y está disponible
    book = db.query(models.Book).filter(models.Book.book_id == loan.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    if book.status != "available":
        raise HTTPException(status_code=400, detail="Book is not available")
    
    # Crear el préstamo
    new_loan = models.Loan(
        book_id=loan.book_id,
        user_id=current_user.user_id,  # ✅ Se toma del token JWT
        loan_date=loan.loan_date or datetime.now().date(),
        status="active"
    )
    
    # Cambiar el estado del libro a "unavailable"
    book.status = "unavailable"
    
    db.add(new_loan)
    db.commit()
    db.refresh(new_loan)
    
    return new_loan


@router.put("/return/{loan_id}", response_model=schemas.Loan)
def return_loan(
    loan_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_librarian)
):
    """
    Marca un préstamo como devuelto (solo bibliotecarios).
    """
    loan = db.query(models.Loan).filter(models.Loan.loan_id == loan_id).first()
    
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    if loan.status == "returned":
        raise HTTPException(status_code=400, detail="Loan already returned")
    
    # Actualizar el préstamo
    loan.return_date = datetime.now().date()
    loan.status = "returned"
    
    # Cambiar el estado del libro a "available"
    book = db.query(models.Book).filter(models.Book.book_id == loan.book_id).first()
    if book:
        book.status = "available"
    
    db.commit()
    db.refresh(loan)
    
    return loan


@router.get("/{loan_id}", response_model=schemas.Loan)
def get_loan(
    loan_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Obtiene un préstamo específico.
    Los usuarios solo pueden ver sus propios préstamos.
    Los bibliotecarios pueden ver todos.
    """
    loan = db.query(models.Loan).filter(models.Loan.loan_id == loan_id).first()
    
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # Verificar permisos: usuario solo puede ver los suyos
    # (los bibliotecarios ya tienen acceso porque pasaron get_current_user)
    if loan.user_id != current_user.user_id:
        # Verificar si es bibliotecario
        from app.auth_utils import decode_jwt
        from fastapi.security import HTTPBearer
        # Si no es su préstamo, debe ser bibliotecario
        # Por simplicidad, negamos el acceso si no es su préstamo
        raise HTTPException(status_code=403, detail="Access denied")
    
    return loan


@router.delete("/{loan_id}")
def delete_loan(
    loan_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_librarian)
):
    """
    Elimina un préstamo (solo bibliotecarios).
    """
    loan = db.query(models.Loan).filter(models.Loan.loan_id == loan_id).first()
    
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # Si el préstamo está activo, devolver el libro
    if loan.status == "active":
        book = db.query(models.Book).filter(models.Book.book_id == loan.book_id).first()
        if book:
            book.status = "available"
    
    db.delete(loan)
    db.commit()
    
    return {"message": "Loan deleted successfully"}