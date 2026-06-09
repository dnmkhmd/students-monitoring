from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from sqlalchemy import func

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
        email="admin@katzu.kz",
        hashed_password=auth.get_password_hash("adminKatzu1957-2026"),
        role="admin",
        full_name="Администратор Системы"
    )
    db.add(admin_user)
    db.commit()

# Проверяем есть ли вакансии
# if db.query(models.Vacancy).count() == 0:
#     v1 = models.Vacancy(
#         title="Frontend Разработчик (React)",
#         company="Tech Solutions",
#         description="Ищем талантливого React разработчика для поддержки и развития внутренних систем мониторинга.",
#         location="Алматы",
#         salary="450 000 - 600 000 ₸",
#         contact_email="hr@techsolutions.kz"
#     )
#     v2 = models.Vacancy(
#         title="Младший Backend Разработчик (FastAPI)",
#         company="KazSoft",
#         description="Разработка API на Python, интеграция с базами данных PostgreSQL, оптимизация запросов.",
#         location="Нур-Султан (Астана)",
#         salary="300 000 - 400 000 ₸",
#         contact_email="jobs@kazsoft.kz"
#     )
#     v3 = models.Vacancy(
#         title="Специалист технической поддержки",
#         company="Telecom Services",
#         description="Консультирование клиентов, решение технических инцидентов, базовая настройка ПО.",
#         location="Караганда",
#         salary="200 000 - 250 000 ₸",
#         contact_email="support@telecom.kz"
#     )
#     db.add_all([v1, v2, v3])
#     db.commit()

# db.close()


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

@app.put("/feedbacks/{feedback_id}/read", response_model=schemas.Feedback, tags=["Feedback"])
def read_feedback(
    feedback_id: int, 
    db: Session = Depends(get_db),
    admin: models.User = Depends(auth.get_admin_user)
):
    feedback = db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    feedback.is_read = True
    db.commit()
    db.refresh(feedback)
    return feedback

# ================= VACANCY APPLICATIONS ENDPOINTS =================

@app.post("/vacancies/{vacancy_id}/apply", response_model=schemas.VacancyApplication, tags=["Vacancy Applications"])
def apply_to_vacancy(
    vacancy_id: int,
    application: schemas.VacancyApplicationCreate,
    db: Session = Depends(get_db)
):
    vacancy = db.query(models.Vacancy).filter(models.Vacancy.id == vacancy_id).first()
    if not vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")
        
    db_app = models.VacancyApplication(
        student_name=application.student_name,
        student_email=application.student_email,
        vacancy_id=vacancy_id,
        message=application.message,
        status="pending",
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

@app.get("/vacancies/applications", response_model=List[schemas.VacancyApplication], tags=["Vacancy Applications"])
def get_vacancy_applications(
    db: Session = Depends(get_db),
    admin: models.User = Depends(auth.get_admin_user)
):
    return db.query(models.VacancyApplication).all()

@app.put("/vacancies/applications/{application_id}/approve", response_model=schemas.VacancyApplication, tags=["Vacancy Applications"])
def approve_vacancy_application(
    application_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(auth.get_admin_user)
):
    app = db.query(models.VacancyApplication).filter(models.VacancyApplication.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = "approved"
    db.commit()
    db.refresh(app)
    return app

@app.put("/vacancies/applications/{application_id}/reject", response_model=schemas.VacancyApplication, tags=["Vacancy Applications"])
def reject_vacancy_application(
    application_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(auth.get_admin_user)
):
    app = db.query(models.VacancyApplication).filter(models.VacancyApplication.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = "rejected"
    db.commit()
    db.refresh(app)
    return app

# ================= NOTIFICATIONS ENDPOINTS =================

@app.get("/admin/notifications/count", tags=["Notifications"])
def get_notifications_count(
    db: Session = Depends(get_db),
    admin: models.User = Depends(auth.get_admin_user)
):
    pending_students = db.query(models.StudentsInformation).filter(models.StudentsInformation.status == "pending").count()
    new_applications = db.query(models.VacancyApplication).filter(models.VacancyApplication.status == "pending").count()
    unread_feedbacks = db.query(models.Feedback).filter(models.Feedback.is_read == False).count()
    
    total = pending_students + new_applications + unread_feedbacks
    
    return {
        "pending_students": pending_students,
        "new_applications": new_applications,
        "unread_feedbacks": unread_feedbacks,
        "total": total
    }

# ================= REVIEWS ENDPOINTS =================

@app.post("/reviews/", response_model=schemas.Review, tags=["Reviews"])
def create_review(review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    db_review = models.Review(
        first_name=review.first_name,
        last_name=review.last_name,
        group_name=review.group_name,
        specialty=review.specialty,
        message=review.message,
        rating=review.rating,
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@app.get("/reviews/", response_model=List[schemas.Review], tags=["Reviews"])
def get_reviews(db: Session = Depends(get_db)):
    return db.query(models.Review).order_by(models.Review.id.desc()).all()

@app.get("/statistics/summary", tags=["Statistics"])
def get_statistics_summary(db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    total = db.query(models.StudentsInformation).count()
    pending = db.query(models.StudentsInformation).filter(models.StudentsInformation.status == "pending").count()
    
    # Employed: status == 'approved' and position is not null, not empty, not 'Не работает'
    employed = db.query(models.StudentsInformation).filter(
        models.StudentsInformation.status == "approved",
        models.StudentsInformation.position != None,
        models.StudentsInformation.position != "",
        models.StudentsInformation.position != "Не работает"
    ).count()
    
    employment_rate = (employed / total * 100) if total > 0 else 0.0
    
    return {
        "total": total,
        "employed": employed,
        "pending": pending,
        "employment_rate": round(employment_rate, 2)
    }

@app.get("/statistics/by-region", tags=["Statistics"])
def get_statistics_by_region(db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    results = db.query(
        models.StudentsInformation.city_region.label('region'),
        func.count(models.StudentsInformation.id).label('count')
    ).filter(
        models.StudentsInformation.status == "approved",
        models.StudentsInformation.city_region != None,
        models.StudentsInformation.city_region != ""
    ).group_by(
        models.StudentsInformation.city_region
    ).order_by(
        func.count(models.StudentsInformation.id).desc()
    ).limit(10).all()
    
    return [{"region": r.region, "count": r.count} for r in results]

@app.get("/statistics/by-specialty", tags=["Statistics"])
def get_statistics_by_specialty(db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    results = db.query(
        models.StudentsInformation.op.label('specialty'),
        func.count(models.StudentsInformation.id).label('count')
    ).filter(
        models.StudentsInformation.status == "approved",
        models.StudentsInformation.op != None,
        models.StudentsInformation.op != ""
    ).group_by(
        models.StudentsInformation.op
    ).order_by(
        func.count(models.StudentsInformation.id).desc()
    ).limit(8).all()
    
    return [{"specialty": r.specialty, "count": r.count} for r in results]

@app.get("/statistics/by-year", tags=["Statistics"])
def get_statistics_by_year(db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    total_results = db.query(
        models.StudentsInformation.released.label('year'),
        func.count(models.StudentsInformation.id).label('total')
    ).filter(
        models.StudentsInformation.released != None,
        models.StudentsInformation.released != ""
    ).group_by(
        models.StudentsInformation.released
    ).all()
    
    employed_results = db.query(
        models.StudentsInformation.released.label('year'),
        func.count(models.StudentsInformation.id).label('employed')
    ).filter(
        models.StudentsInformation.status == "approved",
        models.StudentsInformation.position != None,
        models.StudentsInformation.position != "",
        models.StudentsInformation.position != "Не работает",
        models.StudentsInformation.released != None,
        models.StudentsInformation.released != ""
    ).group_by(
        models.StudentsInformation.released
    ).all()
    
    stats_map = {}
    for r in total_results:
        stats_map[r.year] = {"year": r.year, "total": r.total, "employed": 0}
        
    for r in employed_results:
        if r.year in stats_map:
            stats_map[r.year]["employed"] = r.employed
        else:
            stats_map[r.year] = {"year": r.year, "total": 0, "employed": r.employed}
            
    sorted_stats = sorted(stats_map.values(), key=lambda x: x["year"])
    return sorted_stats