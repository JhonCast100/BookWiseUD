# BookWiseUD — Dockerization, Tests and CI

This repository contains three main components and test artifacts used in Workshop4:

- `Code/Backend` — Python FastAPI backend
- `Code/BackendAuthentication` — Java (Spring Boot) authentication service
- `Code/Frontend` — Frontend app (Vite + React) built and served with nginx

This README explains how to run the application with Docker Compose, how to run unit and acceptance tests, how to run the included JMeter stress plan, and the CI workflow in GitHub Actions.

All instructions assume you are using PowerShell on Windows (adjust `cd` and environment variable commands for other shells).

## 1) Prerequisites

- Docker and Docker Compose installed locally
- Python 3.10+ and a virtual environment for running unit tests locally
- JMeter (for running the provided `.jmx` plan) if you want to replay stress tests locally

## 2) Run unit tests (Python)

Open a PowerShell terminal:

```powershell
cd Code\Backend
venv\Scripts\activate
pytest
```

## 3) Run the full stack with Docker Compose

From the repository root run:

```powershell
docker-compose up --build
```

This will build and start the following services:

- `db` — Postgres database
- `python-backend` — FastAPI app (exposed on host port `8000`)
- `java-backend` — Java auth service (exposed on host port `8080`)
- `frontend` — Frontend served by nginx (host port `5173` mapped to container port `80`)

To stop and remove containers:

```powershell
docker-compose down -v
```

Notes: The Python backend expects a `DATABASE_URL` environment variable; `docker-compose.yml` configures `DATABASE_URL` for a local Postgres instance created by the compose file.

## 4) Acceptance tests (Cucumber / Behave)

Feature files and step definitions are in `Workshop4/cucumber/features`.

To run them locally you must point the steps to the running backend. Example (PowerShell):

```powershell
# start the docker compose stack first (see section above)
cd Workshop4\cucumber
# (optional) set a base URL if your backend is at a different host/port
$env:WORKSHOP4_BASE_URL='http://127.0.0.1:8000'
python -m behave -f pretty
```

If the services are not running, the Cucumber scenarios will fail with connection errors. The file `Workshop4/cucumber/results/cucumber_run.txt` contains a sample run output captured during validation.

## 5) Stress tests (JMeter)

JMeter test plan is available at `Workshop4/jmeter/testplan.jmx`.
There is a sample result file at `Workshop4/jmeter/results/jmeter_results.csv`.

To run the plan (non-GUI) once the backend runs at `http://localhost:8000`:

```powershell
# change paths accordingly to JMeter installation
"C:\\Program Files\\Apache\\jmeter\\bin\\jmeter.bat" -n -t Workshop4\jmeter\testplan.jmx -l Workshop4\jmeter\results\jmeter_results.csv
```

Open the CSV or import into JMeter GUI listeners to inspect results.

## 6) CI / GitHub Actions

The workflow `.github/workflows/ci.yml` runs on push/PR to `main` and:

- Installs Python and dependencies for the Python backend
- Runs `pytest` in `Code/Backend`
- Builds Docker images for the three components (no push)

You can inspect the CI run logs on GitHub Actions for evidence of successful runs. The workflow builds images but does not push them to a registry.

## 7) Evidence included

- Cucumber run sample: `Workshop4/cucumber/results/cucumber_run.txt`
- JMeter sample results: `Workshop4/jmeter/results/jmeter_results.csv`

## 8) Notes and next steps

- I did not modify backend application logic or add mocks — the docker-compose orchestrates real services.
- If you want the CI to run acceptance tests inside the workflow (requires starting services in CI), I can extend the workflow to run `docker-compose` and then run `behave` and `jmeter` inside the job.

If you want, I can now:
- extend CI to run acceptance tests after bringing up services, or
- provide a small script to wait-for the DB and run database migrations before starting the Python backend in container.
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