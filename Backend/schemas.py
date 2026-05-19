from pydantic import BaseModel, field_validator
from typing import Optional

class StudentsInformationBase(BaseModel):
    iin: Optional[str] = None
    category: Optional[str] = None
    bin: Optional[str] = None
    released: Optional[str] = None
    document: Optional[str] = None
    continued_edu: Optional[str] = None
    enterprise_spec: Optional[str] = None
    enterprise_non_spec: Optional[str] = None
    op: Optional[str] = None
    full_name: Optional[str] = None
    position: Optional[str] = None
    grant_contract: Optional[str] = None
    city_region: Optional[str] = None
    status: Optional[str] = "approved"
    
    # Валидатор для конвертации iin в строку
    @field_validator('iin', mode='before')
    @classmethod
    def convert_iin_to_string(cls, v):
        if v is not None:
            return str(v)
        return v

class StudentsInformation(StudentsInformationBase):
    id: int

    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    role: Optional[str] = "viewer"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    email: str
    full_name: Optional[str] = None

class TokenData(BaseModel):
    email: Optional[str] = None

# Vacancy Schemas
class VacancyBase(BaseModel):
    title: str
    company: str
    description: str
    location: str
    salary: Optional[str] = None
    contact_email: Optional[str] = None

class VacancyCreate(VacancyBase):
    pass

class Vacancy(VacancyBase):
    id: int

    class Config:
        from_attributes = True

# Feedback Schemas
class FeedbackBase(BaseModel):
    name: str
    email: str
    message: str

class FeedbackCreate(FeedbackBase):
    user_id: Optional[int] = None

class Feedback(FeedbackBase):
    id: int
    user_id: Optional[int] = None
    created_at: str

    class Config:
        from_attributes = True