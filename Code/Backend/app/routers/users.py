from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.crud import users as crud_users
from app.database import get_db
from app.auth_utils import get_current_librarian

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=list[schemas.User])
def get_all_users(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_librarian)  # ✅ Solo librarians
):
    """Obtener todos los usuarios (solo librarians)"""
    return crud_users.get_users(db)

@router.get("/{user_id}", response_model=schemas.User)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_librarian)  # ✅ Solo librarians
):
    """Obtener usuario específico (solo librarians)"""
    user = crud_users.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=schemas.User)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_librarian)  # ✅ Solo librarians
):
    """Crear nuevo usuario (solo librarians)"""
    try:
        return crud_users.create_user(db, user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{user_id}", response_model=schemas.User)
def update_user(
    user_id: int,
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_librarian)  # ✅ Solo librarians
):
    """Actualizar usuario (solo librarians)"""
    try:
        updated_user = crud_users.update_user(db, user_id, user)
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")
        return updated_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_librarian)  # ✅ Solo librarians
):
    """Eliminar usuario (solo librarians)"""
    user = crud_users.delete_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deactivated successfully"}