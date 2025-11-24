FROM python:3.11-slim
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN python -m pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

ENV PYTHONUNBUFFERED=1
EXPOSE 8000

# Wait for DB to be reachable before starting the app
CMD ["sh", "-c", "python wait_for_db.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
