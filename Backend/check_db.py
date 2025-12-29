# check_db.py
from database import SessionLocal, engine
from models import StudentsInformation
import models

# Создаем таблицы если их нет
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Проверяем количество записей
    count = db.query(StudentsInformation).count()
    print(f"✅ База данных подключена")
    print(f"✅ Таблица students_information существует")
    print(f"📊 Количество записей: {count}")
    
    # Показываем первые 5 записей
    if count > 0:
        print("\nПервые 5 записей:")
        students = db.query(StudentsInformation).limit(5).all()
        for student in students:
            print(f"  ID: {student.id}, ФИО: {student.full_name or '-'}")
    else:
        print("⚠️ Таблица пустая! Нужно добавить данные.")
        
except Exception as e:
    print(f"❌ Ошибка: {e}")
    
finally:
    db.close()