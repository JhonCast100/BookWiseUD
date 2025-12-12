# BookWise - Library Management System

## Project Overview

BookWise is a comprehensive library management system designed for educational institutions and public libraries. The system facilitates book catalog organization, user management, and lending operations through a modern web interface.

**Business Domain:** Library Resource Management

**Core Functionality:** Book inventory management, user authentication, borrowing/returning operations, and statistical reporting.

## Architecture Design

### System Architecture Rationale

![BookWise System Architecture](./images/architecture-diagram.png)
```


Diagram: BookWise System Architecture showing frontend, API gateway, and microservices communication
```

### Repository Structure

```
Final-Project/
├── README.md                          # This documentation
├── WORKSHOP-REPORTS.md               # Technical decisions & engineering analysis
├── docker-compose.yml                # Full system orchestration
├── backend-java/                     # Authentication service (Spring Boot)
├── python-backend/                   # Business logic service (FastAPI)
├── frontend/                         # React TypeScript application
├── docker/                           # Docker configurations
├── Workshop4/                        # Testing & Deployment artifacts
└── utils/                           # Database scripts & utilities
```

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- Java 17+ (for local Java development)
- Python 3.11+ (for local Python development)

### Running with Docker Compose

From the repository root directory:

```bash
# Clone repository
git clone <repository-url>
cd Final-Project

# Start all services
docker-compose up --build

# Services will be available at:
# Frontend: http://localhost:5173
# Python API: http://localhost:8000
# Java API: http://localhost:8080
# API Documentation: http://localhost:8000/docs
```

## Configuration

### Environment Variables

**Python Backend (.env)**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/library_db
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
AUTH_SERVICE_URL=http://localhost:8080
```

**Java Backend (application.properties)**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/securitydb
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
jwt.secret=your-jwt-secret
```

## Testing

### Unit Tests

```bash
# Python Backend Tests
cd python-backend
pytest app/test/ -v

# Java Backend Tests
cd backend-java
mvn test

# Frontend Tests
cd frontend
npm test
```

### Acceptance Tests (Cucumber/Behave)

```bash
cd Workshop4/cucumber
pip install -r requirements.txt
python -m behave features/ -f plain
```

### Load Testing (JMeter)

```bash
cd Workshop4/jmeter
jmeter -n -t testplan_all.jmx -l results/load_test.jtl
```

## API Documentation

### Python Backend (FastAPI)

- Interactive Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

### Java Backend (Spring Boot)

- Endpoints Check: http://localhost:8080/auth

## Docker Configuration

### Building Individual Images

```bash
# Python Backend
docker build -f docker/Dockerfile-python -t bookwise-python .

# Java Backend
docker build -f docker/Dockerfile-java -t bookwise-java .

# Frontend
docker build -f docker/Dockerfile-frontend -t bookwise-frontend .
```

### Service Ports

- Frontend: 5173
- Python Backend: 8000
- Java Backend: 8080
- PostgreSQL: 5432
- MySQL: 3306

## CI/CD Pipeline

The project includes GitHub Actions workflow for:

- Automated testing on pull requests
- Docker image building
- Dependency vulnerability scanning

View workflow status in the "Actions" tab of the repository.

## Engineering Decisions Documentation

### 1. Architectural Patterns

**Domain-Driven Design:** Bounded contexts for authentication and library management

**Microservices Architecture:** Independent deployment of authentication and business services

**Repository Pattern:** Data access abstraction in both backends

### 2. Technology Selection Rationale

**FastAPI:** Chosen for rapid development and automatic OpenAPI documentation

**Spring Boot:** Selected for robust security features and enterprise readiness

**React + TypeScript:** Provides type safety and component reusability

### 3. Database Design

**PostgreSQL for Library Data:** Supports complex queries and transactional integrity

**MySQL for Authentication:** Simple schema with efficient read/write operations

## Troubleshooting

### Database Connection Errors

```bash
# Check if databases are running
docker ps | grep -E "(postgres|mysql)"

# Reset databases
docker-compose down -v
docker-compose up -d db mysql
```

### Service Communication Issues

```bash
# Check service logs
docker-compose logs python-backend
docker-compose logs java-backend

# Verify network connectivity
docker network inspect final-project_default
```

### Frontend Build Errors

```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Future Improvements

- API Gateway Implementation: Single entry point for all backend services
- Message Queue Integration: Async communication between services
- Caching Layer: Redis for frequently accessed data
- Monitoring Stack: Prometheus + Grafana for observability
- Kubernetes Deployment: Production-grade orchestration

## Development Team

- Wilder Steven Hernandez Manosalva - 20212020135
- Jhon Javier Castañeda Alvarado - 20211020100

**Course:** Software Engineering Seminar

**University:** Universidad Distrital Francisco José de Caldas

**Academic Period:** 2025-2

## License

This project is developed for academic purposes as part of the Software Engineering course requirements.
