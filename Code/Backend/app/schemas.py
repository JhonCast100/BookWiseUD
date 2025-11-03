from pydantic import BaseModel
from typing import Optional
from datetime import date

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    category_id: int
    class Config:
        orm_mode = True


class BookBase(BaseModel):
    title: str
    author: str
    publication_year: Optional[int]
    isbn: str
    status: Optional[str] = "available"
    category_id: Optional[int]

class BookCreate(BookBase):
    pass

class Book(BookBase):
    book_id: int
    class Config:
        orm_mode = True


class UserBase(BaseModel):
    full_name: str
    email: str
    phone: Optional[str]
    status: Optional[str] = "active"
    auth_id: Optional[int] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    user_id: int
    class Config:
        orm_mode = True


# ✅ ACTUALIZADO: user_id ahora es opcional porque se toma del JWT
class LoanBase(BaseModel):
    book_id: int
    user_id: Optional[int] = None  # Opcional - se obtiene del token
    loan_date: Optional[date] = None
    return_date: Optional[date] = None
    status: Optional[str] = "active"

# ✅ ACTUALIZADO: LoanCreate solo necesita book_id
class LoanCreate(BaseModel):
    book_id: int
    loan_date: Optional[date] = None

class Loan(LoanBase):
    loan_id: int
    user_id: int  # En la respuesta siempre debe estar
    class Config:
        orm_mode = True