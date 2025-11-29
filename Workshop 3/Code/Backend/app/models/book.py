from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

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