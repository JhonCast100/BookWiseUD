# app/schemas.py
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    category_id: int
    model_config = ConfigDict(from_attributes=True)


class BookBase(BaseModel):
    title: str
    author: str
    publication_year: Optional[int] = None
    isbn: str
    status: Optional[str] = "available"
    category_id: Optional[int] = None

class BookCreate(BookBase):
    pass

class Book(BookBase):
    book_id: int
    model_config = ConfigDict(from_attributes=True)


class UserBase(BaseModel):
    full_name: str
    email: str
    phone: Optional[str] = None
    status: Optional[str] = "active"
    auth_id: Optional[int] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    user_id: int
    model_config = ConfigDict(from_attributes=True)


class LoanBase(BaseModel):
    book_id: int
    user_id: Optional[int] = None
    loan_date: Optional[date] = None
    return_date: Optional[date] = None
    status: Optional[str] = "active"

class LoanCreate(BaseModel):
    book_id: int
    user_id: int  # ✅ AGREGAR ESTE CAMPO (requerido, no opcional)
    loan_date: Optional[date] = None

class Loan(LoanBase):
    loan_id: int
    user_id: int  
    model_config = ConfigDict(from_attributes=True)