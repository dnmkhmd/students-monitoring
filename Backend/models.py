#models.py

from sqlalchemy import Column, Integer, String, Boolean
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
    status = Column(String, default="pending") # "approved" or "pending"

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
    is_read = Column(Boolean, default=False)

class VacancyApplication(Base):
    __tablename__ = "vacancy_applications"

    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String)
    student_email = Column(String)
    vacancy_id = Column(Integer)
    message = Column(String, nullable=True)
    status = Column(String, default="pending") # pending, approved, rejected
    created_at = Column(String)

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String, nullable=True)
    group_name = Column(String, nullable=True)
    specialty = Column(String, nullable=True)
    message = Column(String)
    rating = Column(Integer, nullable=True)
    created_at = Column(String)
