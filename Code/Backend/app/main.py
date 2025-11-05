from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app import models
from app.routers import users, books, loans, stats  # ✅ Agregar stats

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Library System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# ✅ Routers
app.include_router(users.router)
app.include_router(books.router)
app.include_router(loans.router)
app.include_router(stats.router)  # ✅ Agregar stats router

@app.get("/")
def root():
    return {"message": "Library System API running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}