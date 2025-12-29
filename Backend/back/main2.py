import pandas as pd
from sqlalchemy import create_engine

# Чтение CSV с разделителем ';'
df = pd.read_csv(r'D:\Vs Code\Kazbek\StudentsWebApp\Data\students.csv', sep=';')

# Опционально: переименуем столбцы, чтобы не было проблем в PostgreSQL
df.columns = [c.strip().replace(' ', '_').replace('/', '_').replace('(', '').replace(')', '') for c in df.columns]

# Подключение к PostgreSQL
engine = create_engine('postgresql+psycopg2://postgres:postgres@localhost:5432/Students')

# Создание таблицы и импорт данных
df.to_sql('students_info2', engine, if_exists='replace', index=False)

print("Данные успешно импортированы в PostgreSQL!")
