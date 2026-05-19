from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

import models
import schemas
import auth
from database import engine, get_db

# Создаем таблицы в БД (если их нет)
models.Base.metadata.create_all(bind=engine)

# Инициализация стандартного админа и вакансий при запуске
db = Session(bind=engine)
# Проверяем есть ли пользователи
if db.query(models.User).count() == 0:
    admin_user = models.User(
        email="admin@tulekter.kz",
        hashed_password=auth.get_password_hash("admin123"),
        role="admin",
        full_name="Администратор Системы"
    )
    viewer_user = models.User(
        email="viewer@tulekter.kz",
        hashed_password=auth.get_password_hash("viewer123"),
        role="viewer",
        full_name="Наблюдатель Студентов"
    )
    db.add(admin_user)
    db.add(viewer_user)
    db.commit()

# Проверяем есть ли вакансии
if db.query(models.Vacancy).count() == 0:
    v1 = models.Vacancy(
        title="Frontend Разработчик (React)",
        company="Tech Solutions",
        description="Ищем талантливого React разработчика для поддержки и развития внутренних систем мониторинга.",
        location="Алматы",
        salary="450 000 - 600 000 ₸",
        contact_email="hr@techsolutions.kz"
    )
    v2 = models.Vacancy(
        title="Младший Backend Разработчик (FastAPI)",
        company="KazSoft",
        description="Разработка API на Python, интеграция с базами данных PostgreSQL, оптимизация запросов.",
        location="Нур-Султан (Астана)",
        salary="300 000 - 400 000 ₸",
        contact_email="jobs@kazsoft.kz"
    )
    v3 = models.Vacancy(
        title="Специалист технической поддержки",
        company="Telecom Services",
        description="Консультирование клиентов, решение технических инцидентов, базовая настройка ПО.",
        location="Караганда",
        salary="200 000 - 250 000 ₸",
        contact_email="support@telecom.kz"
    )
    db.add_all([v1, v2, v3])
    db.commit()

db.close()


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
    status: str = None,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """
    Получить список всех студентов с пагинацией.
    """
    query = db.query(models.StudentsInformation)
    if status:
        query = query.filter(models.StudentsInformation.status == status)
    students = query.offset(skip).limit(limit).all()
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

# POST одобрить заявку
@app.post("/students/{student_id}/approve", 
          response_model=schemas.StudentsInformation,
          tags=["Students"])
def approve_student(
    student_id: int, 
    db: Session = Depends(get_db)
):
    student = db.query(models.StudentsInformation)\
                .filter(models.StudentsInformation.id == student_id)\
                .first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    student.status = "approved"
    db.commit()
    db.refresh(student)
    return student

# POST отклонить заявку
@app.post("/students/{student_id}/reject", 
          tags=["Students"])
def reject_student(
    student_id: int, 
    db: Session = Depends(get_db)
):
    student = db.query(models.StudentsInformation)\
                .filter(models.StudentsInformation.id == student_id)\
                .first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    db.delete(student)
    db.commit()
    return {"message": "Request rejected successfully"}

# GET количество записей
@app.get("/students-count/", tags=["Students"])
def get_students_count(db: Session = Depends(get_db)):
    """
    Получить общее количество записей в базе данных.
    """
    count = db.query(models.StudentsInformation).count()
    return {"total_students": count}

# ================= AUTHENTICATION ENDPOINTS =================

@app.post("/register", response_model=schemas.User, tags=["Auth"])
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Электронная почта уже зарегистрирована"
        )
    
    hashed_pwd = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_pwd,
        role=user.role or "viewer",
        full_name=user.full_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login", response_model=schemas.Token, tags=["Auth"])
def login_user(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user or not auth.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверная почта или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "email": user.email,
        "full_name": user.full_name or ""
    }

# ================= USER CABINET ENDPOINTS =================

@app.get("/users/me", response_model=schemas.User, tags=["User"])
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.put("/users/me", response_model=schemas.User, tags=["User"])
def update_me(
    user_update: schemas.UserBase, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    # Only allow updating name and email (if email isn't taken)
    if user_update.email != current_user.email:
        exist = db.query(models.User).filter(models.User.email == user_update.email).first()
        if exist:
            raise HTTPException(status_code=400, detail="Этот email уже занят")
        current_user.email = user_update.email
        
    current_user.full_name = user_update.full_name
    db.commit()
    db.refresh(current_user)
    return current_user

# ================= VACANCY ENDPOINTS =================

@app.get("/vacancies/", response_model=List[schemas.Vacancy], tags=["Vacancies"])
def get_vacancies(db: Session = Depends(get_db)):
    return db.query(models.Vacancy).all()

@app.post("/vacancies/", response_model=schemas.Vacancy, tags=["Vacancies"])
def create_vacancy(
    vacancy: schemas.VacancyCreate, 
    db: Session = Depends(get_db),
    admin: models.User = Depends(auth.get_admin_user) # Only admins can create vacancies
):
    db_vacancy = models.Vacancy(**vacancy.dict())
    db.add(db_vacancy)
    db.commit()
    db.refresh(db_vacancy)
    return db_vacancy

# ================= FEEDBACK ENDPOINTS =================

@app.post("/feedbacks/", response_model=schemas.Feedback, tags=["Feedback"])
def create_feedback(feedback: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    db_feedback = models.Feedback(
        name=feedback.name,
        email=feedback.email,
        message=feedback.message,
        user_id=feedback.user_id,
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@app.get("/feedbacks/", response_model=List[schemas.Feedback], tags=["Feedback"])
def get_feedbacks(
    db: Session = Depends(get_db),
    admin: models.User = Depends(auth.get_admin_user) # Only admins can view feedbacks
):
    return db.query(models.Feedback).all()