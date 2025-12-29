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
