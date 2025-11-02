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
    auth_id: Optional[int] = None  # Agregado para compatibilidad

class UserCreate(UserBase):
    pass

class User(UserBase):
    user_id: int
    class Config:
        orm_mode = True


class LoanBase(BaseModel):
    book_id: int
    user_id: int
    loan_date: Optional[date]
    return_date: Optional[date]
    status: Optional[str] = "active"

class LoanCreate(LoanBase):
    pass

class Loan(LoanBase):
    loan_id: int
    class Config:
        orm_mode = True