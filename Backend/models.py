#models.py

from sqlalchemy import Column, Integer, String
from database import Base

class StudentsInformation(Base):
    __tablename__ = "students_information"

    id = Column(Integer, primary_key=True, index=True)
    iin = Column(String, nullable=True)
    category = Column(String)
    bin = Column(String)
    released = Column(String)
    document = Column(String)
    continued_edu = Column(String)
    enterprise_spec = Column(String)
    enterprise_non_spec = Column(String)
    op = Column(String)
    full_name = Column(String)
    position = Column(String)
    grant_contract = Column(String)
    city_region = Column(String)
    status = Column(String, default="approved") # "approved" or "pending"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="viewer") # "admin", "viewer", "student"
    full_name = Column(String, nullable=True)

class Vacancy(Base):
    __tablename__ = "vacancies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    company = Column(String)
    description = Column(String)
    location = Column(String)
    salary = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True) # Optional link to user
    name = Column(String)
    email = Column(String)
    message = Column(String)
    created_at = Column(String) # Storing as string for simplicity, or we can use DateTime
