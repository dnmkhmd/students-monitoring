#!/bin/bash

# Start Backend
echo "Starting Backend..."
(cd Backend && source .venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8000 --reload) &

# Start Frontend
echo "Starting Frontend..."
(cd frontend && npm start)
