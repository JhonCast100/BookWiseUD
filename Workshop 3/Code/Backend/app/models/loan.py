from sqlalchemy import Column, Integer, Date, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

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
