from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import engine, get_db

# Создаем таблицы в БД (если их нет)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Students Web App API",
    description="API для управления информацией о студентах",
    version="1.0.0"
)

# Настройка CORS (если нужно подключаться с фронтенда)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене укажите конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Students Web App API", "docs": "/docs"}

# GET все записи
@app.get("/students/", 
         response_model=List[schemas.StudentsInformation],
         tags=["Students"])
def get_all_students(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Получить список всех студентов с пагинацией.
    """
    students = db.query(models.StudentsInformation)\
                 .offset(skip)\
                 .limit(limit)\
                 .all()
    return students

# GET одну запись по ID
@app.get("/students/{student_id}", 
         response_model=schemas.StudentsInformation,
         tags=["Students"])
def get_student_by_id(
    student_id: int, 
    db: Session = Depends(get_db)
):
    """
    Получить информацию о студенте по ID.
    """
    student = db.query(models.StudentsInformation)\
                .filter(models.StudentsInformation.id == student_id)\
                .first()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with id {student_id} not found"
        )
    return student

# POST создать новую запись
@app.post("/students/", 
          response_model=schemas.StudentsInformation,
          status_code=status.HTTP_201_CREATED,
          tags=["Students"])
def create_student(
    student_data: schemas.StudentsInformationBase, 
    db: Session = Depends(get_db)
):
    """
    Создать новую запись о студенте.
    """
    db_student = models.StudentsInformation(**student_data.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

# PUT обновить запись
@app.put("/students/{student_id}", 
         response_model=schemas.StudentsInformation,
         tags=["Students"])
def update_student(
    student_id: int, 
    student_data: schemas.StudentsInformationBase, 
    db: Session = Depends(get_db)
):
    """
    Обновить информацию о студенте по ID.
    """
    student = db.query(models.StudentsInformation)\
                .filter(models.StudentsInformation.id == student_id)\
                .first()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with id {student_id} not found"
        )
    
    # Обновляем все поля
    for field, value in student_data.dict().items():
        setattr(student, field, value)
    
    db.commit()
    db.refresh(student)
    return student

# DELETE удалить запись
@app.delete("/students/{student_id}", 
            status_code=status.HTTP_204_NO_CONTENT,
            tags=["Students"])
def delete_student(
    student_id: int, 
    db: Session = Depends(get_db)
):
    """
    Удалить запись о студенте по ID.
    """
    student = db.query(models.StudentsInformation)\
                .filter(models.StudentsInformation.id == student_id)\
                .first()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with id {student_id} not found"
        )
    
    db.delete(student)
    db.commit()
    return None

# GET количество записей
@app.get("/students-count/", tags=["Students"])
def get_students_count(db: Session = Depends(get_db)):
    """
    Получить общее количество записей в базе данных.
    """
    count = db.query(models.StudentsInformation).count()
    return {"total_students": count}