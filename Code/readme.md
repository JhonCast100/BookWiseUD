📚 BookWiseUD

BookWiseUD is a smart library management system that simplifies catalog organization, book lending, and user tracking.
Designed for schools, universities, and public libraries, it improves efficiency and access to knowledge through an intuitive web interface and robust backend integration.

🧭 Table of Contents

Project Overview

Architecture

Technologies Used

Folder Structure

1️⃣ Python Backend Setup (Business Logic)

2️⃣ Java Backend Setup (Authentication)

3️⃣ Frontend Setup (Web GUI)

4️⃣ REST API Overview

5️⃣ Unit Testing

6️⃣ Integration Evidence

7️⃣ References

🧩 Project Overview

BookWiseUD connects two backend services (Python and Java) to a modern web frontend.

Java Backend: Handles user authentication and access control (MySQL).

Python Backend: Manages business logic and CRUD operations (PostgreSQL).

Frontend (React + TypeScript): Provides a user-friendly interface for interacting with both APIs.

🏗 Architecture
Frontend (React + TypeScript)
        │
        ├── REST API ───► Python Backend (FastAPI + PostgreSQL)
        │
        └── REST API ───► Java Backend (Spring Boot + MySQL)

💻 Technologies Used

Frontend: React, TypeScript, Vite, Node.js

Python Backend: FastAPI, SQLAlchemy, PostgreSQL, JWT, pytest

Java Backend: Spring Boot, MySQL, JUnit

Tools: pgAdmin, Maven, Visual Studio Code, Postman

📁 Folder Structure
├── backend-java/ # Java Spring Boot Authentication Backend 
├── python-backend/ # Python FastAPI Business Logic Backend
├── Frontend/ # Web GUI
├── utils/ # Database scripts and utilities
└── README.md # This file

1️⃣ Python Backend Setup (Business Logic)
Requirements

Python installed

PostgreSQL with pgAdmin

Database script: python-backend/utils/Script.sql

Configuration

File: .env

DATABASE_URL=postgresql://postgres:"YOUR_PASSWORD"@localhost:5432/library_db
JWT_SECRET_KEY=MTkxNTYyMDIzMTE4NTUxNDc5MTQ1NTE4OTE0NzE5NTEzOTE0MTE4
JWT_ALGORITHM=HS256


Adjust the password and database port if needed.

Run Instructions
cd python-backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv
pip install pydantic[email]
pip install pyjwt
uvicorn app.main:app --reload


Access the API at:

http://127.0.0.1:8000

CORS Configuration

In main.py, adjust the allowed origins according to the frontend port:

allow_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

2️⃣ Java Backend Setup (Authentication)
Requirements

Java JDK 25

Maven 4.0.0

MySQL

Configuration

File: src/resources/config.properties

spring.jpa.hibernate.ddl-auto=update
spring.datasource.url=jdbc:mysql://localhost:3306/securitydb?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=1522
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect


Adjust your password and port if necessary.

Run Instructions
cd backend-java
mvn spring-boot:run


Access the health endpoint:

http://localhost:8080/health

CORS Configuration

In src/main/config/CorsConfig, modify the allowed origin depending on your frontend port.

Alternatively, if using Visual Studio Code, you can run the project easily with the Spring Boot Extension Pack.

3️⃣ Frontend Setup (Web GUI)
Requirements

Node.js (v18+)

NPM or Yarn

Run Instructions
cd Frontend
npm install
npm run dev


Access the interface:

http://localhost:5173

4️⃣ REST API Overview

Both backends expose RESTful APIs that enable full integration with the frontend.

Python Backend (FastAPI + PostgreSQL)

Handles library operations such as:

Books Management (CRUD)

Loans and Returns

User Roles and Permissions

Java Backend (Spring Boot + MySQL)

Manages:

Authentication and Authorization

User Registration and Login

JWT Token Generation and Validation

Each API includes appropriate HTTP methods (GET, POST, PUT, DELETE) and JSON responses.

5️⃣ Unit Testing

BookWiseUD includes automated testing to ensure backend reliability and data consistency.

Python Backend Tests

Framework: pytest

Location: python-backend/test

To run tests:

pytest

Java Backend Tests

Framework: JUnit

Location: backend-java/src/test

To run tests:

mvn test

6️⃣ Integration Evidence

A demonstration video showcasing system functionality and frontend-backend communication is available here:

🎥 Demo Video: https://youtu.be/9yBXenUdeNg

7️⃣ References

FastAPI Documentation — https://fastapi.tiangolo.com

Spring Boot Reference — https://spring.io/projects/spring-boot

PostgreSQL & MySQL Docs

React + TypeScript — https://react.dev

🧑‍💻 Author

Developed by BookWiseUD Team:
Wilder Steven Hernandez Manosalva - 20212020135
Jhon Javier Castañeda Alvarado - 20211020100
Universidad Distrital Francisco José de Caldas
November 2025