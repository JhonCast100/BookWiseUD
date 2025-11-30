# 📚 BookWiseUD — Smart Library Management System

A comprehensive digital library management system combining Python FastAPI backend, Java Spring Boot authentication service, and React + TypeScript frontend.

---

## 🧭 Table of Contents

- [📖 Project Overview](#-project-overview)
- [🏗️ Architecture](#️-architecture)
- [🧰 Technologies](#-technologies)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [🐍 Python Backend](#-python-backend-fastapi)
- [☕ Java Backend](#-java-backend-spring-boot)
- [💻 Frontend](#-frontend-react--vite)
- [🌐 API Reference](#-api-reference)
- [🧪 Testing](#-testing)
- [📊 Workshop 4 — Deployment & Testing](#-workshop-4--deployment--testing)

---

## 📖 Project Overview

BookWiseUD provides a complete solution for managing libraries at schools, universities, and public institutions.

**Key Features:**
- ✅ Book catalog management
- ✅ User registration and authentication
- ✅ Book lending and borrowing system
- ✅ Category organization
- ✅ Admin dashboard with statistics
- ✅ JWT-based security

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│     Frontend (React + TypeScript)       │
│         • Vite build tool               │
│         • Modern UI/UX                  │
└─────────────────────────────────────────┘
          ↓              ↓
    ┌─────────────┐  ┌─────────────────┐
    │  FastAPI    │  │  Spring Boot    │
    │  (Python)   │  │    (Java)       │
    │             │  │                 │
    │ Business    │  │ Authentication  │
    │ Logic       │  │ & Security      │
    └─────────────┘  └─────────────────┘
          ↓              ↓
    ┌─────────────┐  ┌─────────────────┐
    │ PostgreSQL  │  │     MySQL       │
    │             │  │                 │
    │  Library DB │  │  Security DB    │
    └─────────────┘  └─────────────────┘
```

---

## 🧰 Technologies

| Component | Technology Stack |
|-----------|------------------|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS |
| **Python Backend** | FastAPI, SQLAlchemy, PostgreSQL, PyJWT |
| **Java Backend** | Spring Boot, MySQL, JUnit |
| **DevOps** | Docker, Docker Compose, GitHub Actions |
| **Testing** | pytest, Behave, JMeter |

---

## 📁 Project Structure

```
BookWiseUD/
├── Code/
│   ├── Backend/                    ← Python FastAPI backend
│   │   ├── app/
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── tests/
│   ├── BackendAuthentication/      ← Java Spring Boot backend
│   │   ├── src/
│   │   ├── pom.xml
│   │   └── Dockerfile
│   └── Frontend/                   ← React + Vite frontend
│       ├── src/
│       ├── package.json
│       └── Dockerfile
├── MainDocumentation/              ← Project documentation
├── Workshop 3/                     ← Initial setup & architecture
│   ├── Code/
│   ├── docker-compose.yml
│   └── utils/
├── Workshop4/                      ← **Deployment & Testing** ⭐
│   ├── docker-compose.yml
│   ├── cucumber/                   ← Acceptance tests
│   ├── jmeter/                     ← Performance tests
│   ├── docker/                     ← Dockerfiles
│   └── README.md                   ← Workshop 4 detailed guide
├── docker-compose.yml              ← Root orchestration
└── README.md                       ← This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Docker** and **Docker Compose**
- **Python 3.11+** (for local testing)
- **Java 17+** (for local development)
- **Node.js 18+** (for frontend development)

### Start All Services

```powershell
# From repository root
docker-compose up --build

# Wait for services to initialize (~30 seconds)
Start-Sleep -Seconds 30

# Verify services
docker compose ps
```

**Services will be available at:**
- Frontend: http://localhost:5173
- Python API: http://localhost:8000
- Java API: http://localhost:8080

### Stop Services

```powershell
docker-compose down
docker-compose down -v    # Also remove volumes
```

---

## 🐍 Python Backend (FastAPI)

### Location
`Code/Backend/`

### Setup for Local Development

```powershell
cd Code/Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Run Locally

```powershell
# With auto-reload
uvicorn app.main:app --reload

# Or specify port
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**API Docs:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Key Endpoints

- `GET /` – Health check
- `GET /books` – List all books
- `POST /books` – Create book (admin)
- `GET /categories` – List categories
- `GET /loans` – View loans
- `GET /stats/dashboard` – Dashboard stats

---

## ☕ Java Backend (Spring Boot)

### Location
`Code/BackendAuthentication/`

### Setup for Local Development

```powershell
cd Code/BackendAuthentication
mvn clean install
mvn spring-boot:run
```

### Configuration

Update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/securitydb
spring.datasource.username=root
spring.datasource.password=your_password
```

### Key Endpoints

- `POST /auth/login` – User login
- `POST /auth/register` – User registration
- `GET /auth/validate` – Token validation

---

## 💻 Frontend (React + Vite)

### Location
`Code/Frontend/`

### Setup for Local Development

```powershell
cd Code/Frontend
npm install
npm run dev
```

**Access at:** http://localhost:5173

### Build for Production

```powershell
npm run build
npm run preview
```

---

## 🌐 API Reference

### Python Backend - Core Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| `GET` | `/books` | List all books | No |
| `POST` | `/books` | Create book | Yes |
| `GET` | `/books/{id}` | Get book details | No |
| `PUT` | `/books/{id}` | Update book | Yes |
| `DELETE` | `/books/{id}` | Delete book | Yes |
| `GET` | `/categories` | List categories | No |
| `GET` | `/loans` | View loans | Yes |
| `POST` | `/borrow` | Borrow book | Yes |
| `POST` | `/return` | Return book | Yes |

### Java Backend - Authentication Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/auth/login` | Login with credentials |
| `POST` | `/auth/register` | Register new user |
| `GET` | `/auth/validate` | Validate token |

---

## 🧪 Testing

### Unit Tests (Python)

```powershell
cd Code/Backend
pytest
```

### Unit Tests (Java)

```powershell
cd Code/BackendAuthentication
mvn test
```

### Acceptance Tests (Cucumber)

See [Workshop 4 README](#-workshop-4--deployment--testing)

### Performance Tests (JMeter)

See [Workshop 4 README](#-workshop-4--deployment--testing)

---

## 📊 Workshop 4 — Deployment & Testing

**Complete guide for containerization, acceptance testing, and stress testing.**

👉 **See `Workshop4/README.md` for detailed instructions**

### What's Included

- **Docker Infrastructure**
  - Production-ready Dockerfiles for all components
  - docker-compose orchestration with 5 services
  - PostgreSQL and MySQL databases

- **Acceptance Testing (Behave/Cucumber)**
  - 5 feature files with 11 test scenarios
  - Step definitions for HTTP, login, and common operations
  - 100% passing test suite

- **Performance Testing (JMeter)**
  - Comprehensive test plan (testplan_all.jmx)
  - 50 concurrent users, 5-minute duration
  - HTML dashboard with metrics and analysis

- **CI/CD Pipeline (GitHub Actions)**
  - Automated builds on push/PR to main
  - Python and Java test execution
  - Docker image building

### Quick Commands

```powershell
# Start all services
docker-compose up -d --build

# Run acceptance tests
cd Workshop4/cucumber
python -m behave -f plain

# Run JMeter (GUI)
"C:\apache-jmeter\bin\jmeter.bat" -t "Workshop4\jmeter\testplan_all.jmx"

# View JMeter results
Start-Process "Workshop4\jmeter\results\html-report-all\index.html"
```

---

## 📚 Documentation

- **Workshop 3:** Initial design and architecture (`Workshop 3/`)
- **Workshop 4:** Deployment, testing, and CI/CD (`Workshop4/README.md`)
- **API Documentation:** Available in Swagger UI at `/docs` (FastAPI)

---

## 🔗 Useful Links

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Spring Boot Reference](https://spring.io/projects/spring-boot)
- [Docker Documentation](https://docs.docker.com/)
- [Behave Framework](https://behave.readthedocs.io/)
- [Apache JMeter](https://jmeter.apache.org/)

---

## 👨‍💻 Development Team

**BookWiseUD Development:**
- Wilder Steven Hernandez Manosalva (20212020135)
- Jhon Javier Castañeda Alvarado (20211020100)

**Project:** Software Engineering Seminar — Workshops 3 & 4  
**Institution:** Universidad Distrital Francisco José de Caldas  
**Date:** November 2025

---

## 📄 License

This project is developed for educational purposes as part of the Software Engineering course at Universidad Distrital Francisco José de Caldas.

---

**Last Updated:** November 29, 2025  
**Status:** ✅ Complete and Production Ready
