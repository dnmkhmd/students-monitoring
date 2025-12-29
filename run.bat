@echo off
echo ==============================
echo Starting StudentsWebApp
echo ==============================

REM === Backend ===
cd Backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate
pip install -r requirements.txt

start cmd /k "uvicorn main:app --reload"

REM === Frontend ===
cd ../frontend

if not exist node_modules (
    echo Installing frontend dependencies...
    npm install
)

start cmd /k "npm start"

echo ==============================
echo App is running
echo ==============================
pause
