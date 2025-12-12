from sqlalchemy.orm import Session
from app.models.category import Category
from app import models, schemas

def get_categories(db: Session):
    """Obtener todas las categorías"""
    return db.query(Category).all()


def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(
        name=category.name,
        description=category.description
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category