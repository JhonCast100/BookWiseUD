from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import * # importa Category, User, Book, Loan desde models/__init__.py
from app.routers import users, books, loans, stats, category

# Crear todas las tablas (solo al inicio)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Library System API")

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# ✅ Routers
app.include_router(users.router)
app.include_router(books.router)
app.include_router(loans.router)
app.include_router(stats.router)
app.include_router(category.router)

@app.get("/")
def root():
    return {"message": "Library System API running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
