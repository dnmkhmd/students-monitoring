import pandas as pd
from sqlalchemy import create_engine

engine = create_engine('postgresql+psycopg2://postgres:postgres@localhost:5432/Students')

# Читаем таблицу
df = pd.read_sql('SELECT * FROM students_info3 LIMIT 20', engine)

print(df)
