from sqlalchemy.orm import Session
from app.models.user import User
from app import schemas

def get_users(db: Session):
    """Obtener todos los usuarios"""
    return db.query(User).all()

def get_user_by_id(db: Session, user_id: int):
    """Obtener usuario por ID"""
    return db.query(User).filter(User.user_id == user_id).first()

def get_user_by_auth_id(db: Session, auth_id: int):
    """Obtener usuario por auth_id (ID de MySQL)"""
    return db.query(User).filter(User.auth_id == auth_id).first()

def get_user_by_email(db: Session, email: str):
    """Obtener usuario por email"""
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    """Crear un nuevo usuario"""
    # Validar email único
    existing_user = get_user_by_email(db, user.email)
    if existing_user:
        raise ValueError("Email already registered")
    
    # Validar auth_id único (si existe)
    if user.auth_id:
        existing_auth = get_user_by_auth_id(db, user.auth_id)
        if existing_auth:
            raise ValueError("Auth ID already registered")
    
    db_user = User(
        auth_id=user.auth_id,
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        status=user.status
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_update: schemas.UserCreate):
    """Actualizar usuario"""
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    
    # Validar email único
    if user_update.email != user.email:
        existing_email = get_user_by_email(db, user_update.email)
        if existing_email and existing_email.user_id != user_id:
            raise ValueError("Email already registered by another user")
    
    # Actualizar campos
    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(user, key, value)
    
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user_id: int):
    """Eliminar usuario"""
    user = get_user_by_id(db, user_id)
    if user:
        db.delete(user)
        db.commit()
    return user
