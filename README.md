# 📚 BookWiseUD

**Smart Library Management System for Schools, Universities, and Public Libraries.**

BookWiseUD simplifies catalog organization, book lending, and user tracking.  
It combines two integrated backends — FastAPI (Python) and Spring Boot (Java) — connected to a modern React + TypeScript frontend.

---

## 🧭 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Python Backend (Business Logic)](#-python-backend-business-logic)
- [Java Backend (Authentication)](#-java-backend-authentication)
- [Frontend Setup](#-frontend-setup)
- [REST API Reference](#-rest-api-reference)
  - [Python Backend Endpoints](#️-python-backend-endpoints-fastapi--postgresql)
  - [Java Backend Endpoints](#-java-backend-endpoints-spring-boot--mysql)
- [Unit Testing](#-unit-testing)
- [Integration Evidence](#-integration-evidence)
- [References](#-references)

---

## 🧩 Project Overview

BookWiseUD provides a complete digital solution for managing libraries.  
It allows librarians to manage books, categories, and users, while readers can borrow and return books online.

---

## 🏗 Architecture

```
Frontend (React + TypeScript)
        │
        ├── REST API ───► Python Backend (FastAPI + PostgreSQL)
        │                      └── CRUD operations and business logic
        │
        └── REST API ───► Java Backend (Spring Boot + MySQL)
                               └── Authentication and JWT management
```

---

## 🧰 Technologies Used

| Layer | Technology Stack |
|-------|------------------|
| **Frontend** | React, TypeScript, Vite |
| **Python Backend** | FastAPI, SQLAlchemy, PostgreSQL, PyJWT, pytest |
| **Java Backend** | Spring Boot, MySQL, JUnit |
| **Tools** | pgAdmin, Maven, Visual Studio Code, Postman |

---

## 📁 Project Structure

```
Workshop3
├── backend-java/        # Java Spring Boot Authentication Backend 
├── python-backend/      # Python FastAPI Business Logic Backend
├── Frontend/            # Web GUI (React + TypeScript)
├── utils/               # Database scripts and utilities
└── README.md            # Project documentation
```

---

## 🐍 Python Backend (Business Logic)

### Requirements

- Python installed
- PostgreSQL and pgAdmin
- Database script: `utils/ScriptLibrary-posgresql.sql`

### Configuration

Create a `.env` file inside `python-backend`:

```env
DATABASE_URL=postgresql://postgres:"YOUR_PASSWORD"@localhost:5432/library_db
JWT_SECRET_KEY=MTkxNTYyMDIzMTE4NTUxNDc5MTQ1NTE4OTE0NzE5NTEzOTE0MTE4
JWT_ALGORITHM=HS256
```

Adjust database password and port if needed.

### Run Instructions

```bash
cd python-backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv
pip install pydantic[email]
pip install pyjwt
uvicorn app.main:app --reload
```

Access the API at:  
👉 **http://127.0.0.1:8000**

### CORS Configuration

In `main.py`:

```python
allow_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]
```

---

## ☕ Java Backend (Authentication)

### Requirements

- Java 25
- Maven 4.0.0
- MySQL installed
- Database script: `utils/ScriptSecurity-mysql.sql`

### Configuration

File: `src/resources/config.properties`

```properties
spring.jpa.hibernate.ddl-auto=update
spring.datasource.url=jdbc:mysql://localhost:3306/securitydb?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=1522
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

### Run Instructions

```bash
cd backend-java
mvn spring-boot:run
```

Access the API health check:  
👉 **http://localhost:8080/health**

If using VS Code, install the **Spring Boot Extension Pack** for simplified execution.

---

## 💻 Frontend Setup

### Requirements

- Node.js v18+
- NPM or Yarn

### Run Instructions

```bash
cd Frontend
npm install
npm run dev
```

Access at:  
👉 **http://localhost:5173**

---

## 🌐 REST API Reference

### ⚙️ Python Backend Endpoints (FastAPI + PostgreSQL)

#### Users (`/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/users/` | Get all users | Librarian |
| `GET` | `/users/{user_id}` | Get specific user | Librarian |
| `POST` | `/users/` | Create new user | Librarian |
| `PUT` | `/users/{user_id}` | Update user info | Librarian |
| `DELETE` | `/users/{user_id}` | Delete user | Librarian |

#### Books (`/books`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/books/` | Get all books |
| `GET` | `/books/available` | Get available books |
| `GET` | `/books/search?search=term` | Search books |
| `POST` | `/books/` | Create a new book |
| `PUT` | `/books/{book_id}` | Update book |
| `DELETE` | `/books/{book_id}` | Delete book |

#### Loans (`/loans`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/loans/` | Get all loans | Librarian |
| `GET` | `/loans/me` | Get my loans | Authenticated users |
| `GET` | `/loans/active` | Get active loans | Librarian |
| `POST` | `/loans/` | Create new loan | Librarian |
| `PUT` | `/loans/return/{loan_id}` | Mark loan as returned | Librarian |
| `GET` | `/loans/{loan_id}` | Get specific loan | User or Librarian |
| `DELETE` | `/loans/{loan_id}` | Delete loan | Librarian |

#### Categories (`/categories`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/categories/` | Retrieve all categories |

#### Statistics (`/stats`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/stats/dashboard` | Dashboard statistics (books, users, loans) |

---

### 🔐 Java Backend Endpoints (Spring Boot + MySQL)

#### Authentication (`/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | User login with credentials |
| `POST` | `/auth/register` | Register a new user |

**Sample JSON – Login**

```json
{
  "username": "librarian1",
  "password": "password123"
}
```

**Sample Response**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

---

## 🧪 Unit Testing

Automated tests ensure data integrity and functionality across both backends.

### Python Backend

- **Framework:** pytest
- **Directory:** `python-backend/app/test`

```bash
pytest
```

### Java Backend

- **Framework:** JUnit
- **Directory:** `backend-java/src/test`

```bash
mvn test
```

---

## 🎥 Integration Evidence

A full demonstration video of the system's integration and functionality is available at:  
👉 **https://youtu.be/9yBXenUdeNg**

The video showcases:

- Backend communication (FastAPI ↔ Spring Boot)
- Frontend integration and API usage
- Dashboard statistics and book loan workflow

Test Evidence
Java Backend Tests (JUnit)

![Java Test 1](./Code/img/test1.jpg)
![Java Test 2](./Code/img/test2.jpg)

Python Backend Tests (pytest)

![Python Test](./Code/img/test3.jpg)

---

## 📚 References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Spring Boot Reference](https://spring.io/projects/spring-boot)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [React + TypeScript Docs](https://react.dev/)

---

## 👩‍💻 Developed by

**BookWiseUD Team:**
- Wilder Steven Hernandez Manosalva - 20212020135
- Jhon Javier Castañeda Alvarado - 20211020100

**Software Engineering Seminar — Workshop No. 3**  
Universidad Distrital Francisco José de Caldas  
November 2025