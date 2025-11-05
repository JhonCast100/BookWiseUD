from sqlalchemy.orm import Session
from app import models

def get_categories(db: Session):
    return db.query(models.Category).all()
