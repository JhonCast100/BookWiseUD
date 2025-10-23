from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Category(Base):
    __tablename__ = "category"
    category_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String)

    books = relationship("Book", back_populates="category")

class User(Base):
    __tablename__ = "app_user"
    user_id = Column(Integer, primary_key=True, index=True)
    auth_id = Column(Integer)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    phone = Column(String(20))
    status = Column(String(20), default="active")

    loans = relationship("Loan", back_populates="user")

class Book(Base):
    __tablename__ = "book"
    book_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    author = Column(String(100), nullable=False)
    publication_year = Column(Integer)
    isbn = Column(String(50), unique=True, nullable=False)
    status = Column(String(20), default="available")
    category_id = Column(Integer, ForeignKey("category.category_id"))

    category = relationship("Category", back_populates="books")
    loans = relationship("Loan", back_populates="book")

class Loan(Base):
    __tablename__ = "loan"
    loan_id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("book.book_id"))
    user_id = Column(Integer, ForeignKey("app_user.user_id"))
    loan_date = Column(Date)
    return_date = Column(Date)
    status = Column(String(20), default="active")

    book = relationship("Book", back_populates="loans")
    user = relationship("User", back_populates="loans")
