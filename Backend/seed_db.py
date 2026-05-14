import csv
import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import StudentsInformation, Base

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def import_csv(file_path: str):
    db: Session = SessionLocal()
    try:
        with open(file_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Handle empty strings as None
                cleaned_row = {k: (v if v.strip() != "" and v.upper() != "NULL" else None) for k, v in row.items()}
                
                # Check if student already exists by IIN or ID to avoid duplicates
                student_id = int(cleaned_row.get('id'))
                existing = db.query(StudentsInformation).filter(StudentsInformation.id == student_id).first()
                
                if not existing:
                    student = StudentsInformation(
                        id=student_id,
                        op=cleaned_row.get('op'),
                        full_name=cleaned_row.get('full_name'),
                        iin=cleaned_row.get('iin'),
                        grant_contract=cleaned_row.get('grant_contract'),
                        category=cleaned_row.get('category'),
                        bin=cleaned_row.get('bin'),
                        enterprise_spec=cleaned_row.get('enterprise_spec'),
                        enterprise_non_spec=cleaned_row.get('enterprise_non_spec'),
                        position=cleaned_row.get('position'),
                        city_region=cleaned_row.get('city_region'),
                        continued_edu=cleaned_row.get('continued_edu'),
                        released=cleaned_row.get('released'),
                        document=cleaned_row.get('document')
                    )
                    db.add(student)
            
            db.commit()
            print(f"Successfully imported data from {file_path}")
    except Exception as e:
        db.rollback()
        print(f"Error importing data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    csv_file = "/Users/dimash/Desktop/folders/dp/Kazbek/students-monitoring/Data/data-1773310485125.csv"
    import_csv(csv_file)
