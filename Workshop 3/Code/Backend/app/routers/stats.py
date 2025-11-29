# app/routers/stats.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user import User  # ✅ Importación explícita
from app.models.book import Book  # ✅ Importación explícita
from app.models.loan import Loan  # ✅ Importación explícita
from app.auth_utils import get_current_user

router = APIRouter(prefix="/stats", tags=["Statistics"])


@router.get("/dashboard")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # ✅ Usa User directamente
):
    """
    Obtiene estadísticas para el dashboard.
    Todos los usuarios autenticados pueden ver estas estadísticas.
    """
    total_books = db.query(func.count(Book.book_id)).scalar()
    total_users = db.query(func.count(User.user_id)).scalar()
    active_loans = db.query(func.count(Loan.loan_id))\
        .filter(Loan.status == "active")\
        .scalar()
    available_books = db.query(func.count(Book.book_id))\
        .filter(Book.status == "available")\
        .scalar()
    
    return {
        "total_books": total_books or 0,
        "total_users": total_users or 0,
        "active_loans": active_loans or 0,
        "available_books": available_books or 0
    }