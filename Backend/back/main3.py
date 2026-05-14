import pandas as pd
from sqlalchemy import create_engine

# Чтение CSV с двумя строками заголовков (основной + подстолбец)
df = pd.read_csv(
    r'D:\Vs Code\Kazbek\StudentsWebApp\Data\students.csv',
    sep=';', 
    header=[0, 1]  # читаем две строки заголовков
)

# Объединяем многомерные заголовки в один уровень
df.columns = ['_'.join(filter(None, map(str, col))).strip() for col in df.columns]

# Подключение к PostgreSQL
engine = create_engine('postgresql+psycopg2://postgres:postgres2026@localhost:5432/Students')

# Создание таблицы и импорт данных
df.to_sql('students_information', engine, if_exists='replace', index=False)

print("Данные успешно импортированы в PostgreSQL!")
