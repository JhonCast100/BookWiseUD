from sqlalchemy.orm import Session
from app.models.category import Category

def get_categories(db: Session):
    """Obtener todas las categorías"""
    return db.query(Category).all()
