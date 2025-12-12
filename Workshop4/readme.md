## 📋 Overview

Workshop 4 contains all deliverables for deployment, acceptance testing (Cucumber/Behave), and stress testing (JMeter) of the BookWise application. This includes:

- ✅ **Dockerfiles** for all three components (Java Backend, Python Backend, Frontend)
- ✅ **docker-compose.yml** to orchestrate all services
- ✅ **Cucumber features & step definitions** for acceptance testing (Behave framework)
- ✅ **JMeter test plans** (JMX) with stress testing results
- ✅ **GitHub Actions CI/CD workflow** for automated builds and testing

---

## 🐳 1. Docker & docker-compose

### Dockerfiles Location

All Dockerfiles are located in the `docker/` directory:

| Component | Dockerfile | Language | Port |
|-----------|-----------|----------|------|
| **Backend Java (Spring Boot)** | `docker/DockerFile-java` | Java 17 | 8080 |
| **Backend Python (FastAPI)** | `docker/DockerFile-python` | Python 3.11 | 8000 |
| **Frontend (Vite + React)** | `docker/DockerFile-frontend` | Node 18 | 5173 |

### Docker Compose Configuration

**File:** `docker-compose.yml` (root level of BookWiseUD)

**Services:**
- `db` – PostgreSQL 15 (BookWise catalog database)
- `mysql` – MySQL 8.0 (Authentication/Security database)
- `python-backend` – FastAPI service (port 8000)
- `java-backend` – Spring Boot auth service (port 8080)
- `frontend` – React Vite application (port 5173)

### How to Run All Services Locally

From the repository **root** directory:

```powershell
# Start all services with build
docker-compose up --build

# Or just start if images are already built
docker-compose up -d

# Wait for all services to be ready
Start-Sleep -Seconds 30
```

**Verify Services Are Running:**

```powershell
docker compose ps
```

### Stop Services

```powershell
docker-compose down

# Remove volumes (clean database)
docker-compose down -v
```

---

## 🥒 2. Cucumber Acceptance Testing (Behave)

### Features Location

All feature files are in: `Workshop4/cucumber/features/`

**Available features:**
- `login.feature` – User login scenarios
- `register.feature` – User registration scenarios
- `books.feature` – Book listing and details
- `book_management.feature` – Adding/updating/deleting books
- `borrow_return.feature` – Borrowing and returning books

### Step Definitions

Located in: `Workshop4/cucumber/features/steps/`

**Key files:**
- `http_steps.py` – Generic HTTP request steps (GET, POST, PUT, DELETE)
- `login_steps.py` – Authentication and login step implementations

### How to Run Cucumber Tests

#### Prerequisites

Install dependencies:

```powershell
cd Workshop4/cucumber
pip install -r requirements.txt
```

#### Run All Features

```powershell
cd Workshop4/cucumber
python -m behave -f plain
```

#### Run a Specific Feature

```powershell
behave features/login.feature -f plain
```

### Test Results

Results are saved to: `Workshop4/cucumber/results/`

**Example output:**
```
Feature: User login
  Scenario: Successful login
    Given a user with email "john.doe@example.com" and password "Jd@2025!Secure" ... passed
    When the user submits valid credentials to "/api/auth/login" ... passed
    Then the response status should be 200 ... passed

11 scenarios passed, 0 failed
```

---

## 🔥 3. JMeter Stress Testing

### Test Plans

Located in: `Workshop4/jmeter/`

**Files:**
- `testplan_all.jmx` – Comprehensive test plan covering main endpoints

### Test Coverage

The test plan includes:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Backend health check |
| `/api/books` | GET | List all books |
| `/api/books/{id}` | GET | Get book details |
| `/api/categories` | GET | List categories |
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | User login |
| `/api/borrow` | POST | Borrow a book |
| `/api/return` | POST | Return a book |

### How to Run JMeter

#### Option 1: GUI Mode

```powershell
# Windows example (adjust path to your JMeter installation)
"C:\apache-jmeter\bin\jmeter.bat" -t "Workshop4\jmeter\testplan_all.jmx"
```

#### Option 2: Non-GUI Mode (Batch Execution)

```powershell
cd Workshop4/jmeter

# Run test plan
"C:\apache-jmeter\bin\jmeter.bat" -n -t "testplan_all.jmx" -l "results\result_all.jtl" -e -o "results\html-report-all"

# View results in browser
Start-Process "results\html-report-all\index.html"
```

### Test Results

Results are stored in: `Workshop4/jmeter/results/`

**Files:**
- `result_all.jtl` – Raw JMeter results (XML format)
- `html-report-all/index.html` – **HTML dashboard** (open in browser)
- `jmeter_results.csv` – CSV summary

**Example Result Summary:**
```
Total Requests: 90
Successful: 60 (66.67% success rate)
Failed: 30 (protected endpoints without auth)
Average Response Time: 45 ms
```

---

## ⚙️ 4. GitHub Actions CI/CD Pipeline

### Workflow Files

Located in `.github/workflows/`:
- `build.yml` – Main CI/CD workflow
- Other workflow files for specific triggers

### What the Pipeline Does

On **push to `main`** or **pull request**, the workflow:

1. ✅ **Checks out code** from the repository
2. ✅ **Sets up Python 3.11** (for backend tests)
3. ✅ **Sets up Java 17** (for Spring Boot builds)
4. ✅ **Builds Docker images** for all components
5. ✅ **Runs tests** where applicable

---

## 📁 Directory Structure

```
Workshop4/
├── README.md                           ← THIS FILE
├── docker-compose.yml                  ← Service orchestration
├── docker/
│   ├── DockerFile-frontend             ← Frontend image definition
│   ├── DockerFile-java                 ← Java service image definition
│   └── DockerFile-python               ← Python service image definition
├── cucumber/
│   ├── features/                       ← Cucumber .feature files
│   │   ├── login.feature
│   │   ├── register.feature
│   │   ├── books.feature
│   │   ├── book_management.feature
│   │   └── borrow_return.feature
│   ├── features/steps/                 ← Step implementations
│   │   ├── http_steps.py
│   │   └── login_steps.py
│   ├── requirements.txt                ← Behave dependencies
│   └── results/                        ← Test execution results
├── jmeter/
│   ├── testplan_all.jmx                ← Comprehensive test plan
│   ├── README.md                       ← JMeter documentation
│   └── results/                        ← JMeter results (JTL, CSV, HTML)
└── dumps/                              ← Database backup files
```

---

## 🚀 Quick Start Guide

### For Local Development

```powershell
# 1. Start all services
docker-compose up -d --build

# 2. Wait for services to initialize
Start-Sleep -Seconds 30

# 3. Run Cucumber tests
cd Workshop4/cucumber
python -m behave -f plain

# 4. Run JMeter stress tests (using GUI)
# Open JMeter and load testplan_all.jmx from Workshop4/jmeter/
```

### For CI/CD Pipeline (GitHub Actions)

Simply push to `main`:

```powershell
git add .
git commit -m "Add feature"
git push origin main
```

The workflow will automatically build and test.

---

## 📊 Test Evidence & Results

### Cucumber Results

Located in: `Workshop4/cucumber/results/`

Shows all feature scenarios and pass/fail status.

### JMeter HTML Report

Located in: `Workshop4/jmeter/results/html-report-all/index.html`

Interactive dashboard showing:
- Response time graphs
- Throughput analysis
- Request/response details

---

## 🔧 Troubleshooting

### Services Not Starting

```powershell
# Check logs
docker-compose logs python-backend
docker-compose logs java-backend

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### Cucumber Tests Failing

```powershell
# Verify services are running
docker-compose ps

# Run with verbose output
cd Workshop4/cucumber
python -m behave --no-capture -f plain
```

### JMeter Connection Issues

Ensure services are running and accessible on localhost:8000 and localhost:8080.

---

## ✅ Deliverables

- [x] **Dockerfiles** – All three components
- [x] **docker-compose.yml** – Service orchestration
- [x] **Cucumber Features** – 5 feature files
- [x] **Cucumber Steps** – HTTP and login implementations
- [x] **JMeter Test Plan** – Comprehensive endpoint coverage
- [x] **JMeter Results** – HTML reports with analysis
- [x] **GitHub Actions** – CI/CD workflow
- [x] **Documentation** – This README with full instructions

---

**Last Updated:** November 29, 2025
**Status:** ✅ All deliverables complete and tested
## 📋 Overview

Workshop 4 contains all deliverables for deployment, acceptance testing (Cucumber/Behave), and stress testing (JMeter) of the BookWise application. This includes:

- ✅ **Dockerfiles** for all three components (Java Backend, Python Backend, Frontend)
- ✅ **docker-compose.yml** to orchestrate all services
- ✅ **Cucumber features & step definitions** for acceptance testing (Behave framework)
- ✅ **JMeter test plans** (JMX) with stress testing results
- ✅ **GitHub Actions CI/CD workflow** for automated builds and testing

---

>>>>>>> 2f18da2 (fix: correct Workshop4 README and update Behave step definitions with correct API base URL)
## 🐳 1. Docker & docker-compose

### Dockerfiles Location

All Dockerfiles are located in the `docker/` directory:

| Component | Dockerfile | Language | Port |
|-----------|-----------|----------|------|
| **Backend Java (Spring Boot)** | `docker/DockerFile-java` | Java 17 | 8080 |
| **Backend Python (FastAPI)** | `docker/DockerFile-python` | Python 3.11 | 8000 |
| **Frontend (Vite + React)** | `docker/DockerFile-frontend` | Node 18 | 5173 |

### Docker Compose Configuration

**File:** `docker-compose.yml` (root level of BookWiseUD)

**Services:**
- `db` – PostgreSQL 15 (BookWise catalog database)
- `mysql` – MySQL 8.0 (Authentication/Security database)
- `python-backend` – FastAPI service (port 8000)
- `java-backend` – Spring Boot auth service (port 8080)
- `frontend` – React Vite application (port 5173)

### How to Run All Services Locally

From the repository **root** directory:

```powershell
# Start all services with build
docker-compose up --build

# Or just start if images are already built
docker-compose up -d

# Wait for all services to be ready
Start-Sleep -Seconds 30
```

**Verify Services Are Running:**

```powershell
docker compose ps
```

### Stop Services

```powershell
docker-compose down

# Remove volumes (clean database)
docker-compose down -v
```

---

## 🥒 2. Cucumber Acceptance Testing (Behave)

### Features Location

All feature files are in: `Workshop4/cucumber/features/`

**Available features:**
- `login.feature` – User login scenarios
- `register.feature` – User registration scenarios
- `books.feature` – Book listing and details
- `book_management.feature` – Adding/updating/deleting books
- `borrow_return.feature` – Borrowing and returning books

### Step Definitions

Located in: `Workshop4/cucumber/features/steps/`

**Key files:**
- `http_steps.py` – Generic HTTP request steps (GET, POST, PUT, DELETE)
- `login_steps.py` – Authentication and login step implementations

### How to Run Cucumber Tests

#### Prerequisites

Install dependencies:

```powershell
cd Workshop4/cucumber
pip install -r requirements.txt
```

#### Run All Features

```powershell
cd Workshop4/cucumber
python -m behave -f plain
```

#### Run a Specific Feature

```powershell
behave features/login.feature -f plain
```

### Test Results

Results are saved to: `Workshop4/cucumber/results/`

**Example output:**
```
Feature: User login
  Scenario: Successful login
    Given a user with email "john.doe@example.com" and password "Jd@2025!Secure" ... passed
    When the user submits valid credentials to "/api/auth/login" ... passed
    Then the response status should be 200 ... passed

11 scenarios passed, 0 failed
```

---

## 🔥 3. JMeter Stress Testing

### Test Plans

Located in: `Workshop4/jmeter/`

**Files:**
- `testplan_all.jmx` – Comprehensive test plan covering main endpoints

### Test Coverage

The test plan includes:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Backend health check |
| `/api/books` | GET | List all books |
| `/api/books/{id}` | GET | Get book details |
| `/api/categories` | GET | List categories |
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | User login |
| `/api/borrow` | POST | Borrow a book |
| `/api/return` | POST | Return a book |

### How to Run JMeter

#### Option 1: GUI Mode

```powershell
# Windows example (adjust path to your JMeter installation)
"C:\apache-jmeter\bin\jmeter.bat" -t "Workshop4\jmeter\testplan_all.jmx"
```

#### Option 2: Non-GUI Mode (Batch Execution)

```powershell
cd Workshop4/jmeter

# Run test plan
"C:\apache-jmeter\bin\jmeter.bat" -n -t "testplan_all.jmx" -l "results\result_all.jtl" -e -o "results\html-report-all"

# View results in browser
Start-Process "results\html-report-all\index.html"
```

### Test Results

Results are stored in: `Workshop4/jmeter/results/`

**Files:**
- `result_all.jtl` – Raw JMeter results (XML format)
- `html-report-all/index.html` – **HTML dashboard** (open in browser)
- `jmeter_results.csv` – CSV summary

**Example Result Summary:**
```
Total Requests: 90
Successful: 60 (66.67% success rate)
Failed: 30 (protected endpoints without auth)
Average Response Time: 45 ms
```

---

## ⚙️ 4. GitHub Actions CI/CD Pipeline

### Workflow Files

Located in `.github/workflows/`:
- `build.yml` – Main CI/CD workflow
- Other workflow files for specific triggers

### What the Pipeline Does

On **push to `main`** or **pull request**, the workflow:

1. ✅ **Checks out code** from the repository
2. ✅ **Sets up Python 3.11** (for backend tests)
3. ✅ **Sets up Java 17** (for Spring Boot builds)
4. ✅ **Builds Docker images** for all components
5. ✅ **Runs tests** where applicable

---

## 📁 Directory Structure

```
Workshop4/
├── README.md                           ← THIS FILE
├── docker-compose.yml                  ← Service orchestration
├── docker/
│   ├── DockerFile-frontend             ← Frontend image definition
│   ├── DockerFile-java                 ← Java service image definition
│   └── DockerFile-python               ← Python service image definition
├── cucumber/
│   ├── features/                       ← Cucumber .feature files
│   │   ├── login.feature
│   │   ├── register.feature
│   │   ├── books.feature
│   │   ├── book_management.feature
│   │   └── borrow_return.feature
│   ├── features/steps/                 ← Step implementations
│   │   ├── http_steps.py
│   │   └── login_steps.py
│   ├── requirements.txt                ← Behave dependencies
│   └── results/                        ← Test execution results
├── jmeter/
│   ├── testplan_all.jmx                ← Comprehensive test plan
│   ├── README.md                       ← JMeter documentation
│   └── results/                        ← JMeter results (JTL, CSV, HTML)
└── dumps/                              ← Database backup files
```

---

## 🚀 Quick Start Guide

### For Local Development

```powershell
# 1. Start all services
docker-compose up -d --build

# 2. Wait for services to initialize
Start-Sleep -Seconds 30

# 3. Run Cucumber tests
cd Workshop4/cucumber
python -m behave -f plain

# 4. Run JMeter stress tests (using GUI)
# Open JMeter and load testplan_all.jmx from Workshop4/jmeter/
```

### For CI/CD Pipeline (GitHub Actions)

Simply push to `main`:

```powershell
git add .
git commit -m "Add feature"
git push origin main
```

The workflow will automatically build and test.

---

## 📊 Test Evidence & Results

### Cucumber Results

Located in: `Workshop4/cucumber/results/`

Shows all feature scenarios and pass/fail status.

### JMeter HTML Report

Located in: `Workshop4/jmeter/results/html-report-all/index.html`

Interactive dashboard showing:
- Response time graphs
- Throughput analysis
- Request/response details

---

## 🔧 Troubleshooting

### Services Not Starting

```powershell
# Check logs
docker-compose logs python-backend
docker-compose logs java-backend

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### Cucumber Tests Failing

```powershell
# Verify services are running
docker-compose ps

# Run with verbose output
cd Workshop4/cucumber
python -m behave --no-capture -f plain
```

### JMeter Connection Issues

Ensure services are running and accessible on localhost:8000 and localhost:8080.

---

## ✅ Deliverables

- [x] **Dockerfiles** – All three components
- [x] **docker-compose.yml** – Service orchestration
- [x] **Cucumber Features** – 5 feature files
- [x] **Cucumber Steps** – HTTP and login implementations
- [x] **JMeter Test Plan** – Comprehensive endpoint coverage
- [x] **JMeter Results** – HTML reports with analysis
- [x] **GitHub Actions** – CI/CD workflow
- [x] **Documentation** – This README with full instructions

---

**Last Updated:** November 29, 2025
**Status:** ✅ All deliverables complete and tested

