from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app import models
from app.auth_utils import get_current_user

router = APIRouter(prefix="/stats", tags=["Statistics"])


@router.get("/dashboard")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Obtiene estadísticas para el dashboard.
    Todos los usuarios autenticados pueden ver estas estadísticas.
    """
    total_books = db.query(func.count(models.Book.book_id)).scalar()
    total_users = db.query(func.count(models.User.user_id)).scalar()
    active_loans = db.query(func.count(models.Loan.loan_id))\
        .filter(models.Loan.status == "active")\
        .scalar()
    available_books = db.query(func.count(models.Book.book_id))\
        .filter(models.Book.status == "available")\
        .scalar()
    
    return {
        "total_books": total_books or 0,
        "total_users": total_users or 0,
        "active_loans": active_loans or 0,
        "available_books": available_books or 0
    }