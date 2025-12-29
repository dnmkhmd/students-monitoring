from sqlalchemy import create_engine

engine = create_engine("postgresql+psycopg2://postgres:postgres@localhost:5432/Students")

try:
    with engine.connect() as conn:
        print("Connected successfully!")
except Exception as e:
    print("Error:", e)
