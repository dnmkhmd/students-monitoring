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