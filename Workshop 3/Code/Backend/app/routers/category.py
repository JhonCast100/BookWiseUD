from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import schemas
from app.crud import category as crud_category
from app.database import get_db

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("/", response_model=list[schemas.Category])
def get_all_categories(db: Session = Depends(get_db)):
    return crud_category.get_categories(db)


@router.post("/", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    return crud_category.create_category(db, category)