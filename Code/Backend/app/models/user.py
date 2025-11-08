from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "app_user"
    user_id = Column(Integer, primary_key=True, index=True)
    auth_id = Column(Integer)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    phone = Column(String(20))
    status = Column(String(20), default="active")

    loans = relationship("Loan", back_populates="user")
