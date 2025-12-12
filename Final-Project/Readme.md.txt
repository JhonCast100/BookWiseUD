BookWise - Library Management System Project Overview BookWise is a
comprehensive library management system designed for educational
institutions and public libraries. The system facilitates book catalog
organization, user management, and lending operations through a modern
web interface.

Business Domain: Library Resource Management Core Functionality: Book
inventory management, user authentication, borrowing/returning
operations, and statistical reporting.

Architecture Design System Architecture Rationale
https://images/architecture-diagram.png

Diagram: BookWise System Architecture showing frontend, API gateway, and
microservices communication

Repository Structure Final-Project/ ├── README.md ├──
WORKSHOP-REPORTS.md ├── docker-compose.yml ├── backend-java/ ├──
python-backend/ ├── frontend/ ├── docker/ ├── Workshop4/ └── utils/

Quick Start Prerequisites Docker & Docker Compose Node.js 18+ Java 17+
Python 3.11+

Running with Docker Compose # Clone repository git clone cd
Final-Project

Start all services

docker-compose up –build

Services will be available at:

Frontend: http://localhost:5173

Python API: http://localhost:8000

Java API: http://localhost:8080

API Documentation: http://localhost:8000/docs

Configuration Environment Variables Python Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/library_db
JWT_SECRET_KEY=your-secret-key-here JWT_ALGORITHM=HS256
AUTH_SERVICE_URL=http://localhost:8080

Java Backend (application.properties)
spring.datasource.url=jdbc:mysql://localhost:3306/securitydb
spring.datasource.username=root spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update jwt.secret=your-jwt-secret

Testing Unit Tests # Python Backend Tests cd python-backend pytest
app/test/ -v

Java Backend Tests

cd backend-java mvn test

Frontend Tests

cd frontend npm test

Acceptance Tests (Cucumber/Behave) cd Workshop4/cucumber pip install -r
requirements.txt python -m behave features/ -f plain

Load Testing (JMeter) cd Workshop4/jmeter jmeter -n -t testplan_all.jmx
-l results/load_test.jtl

API Documentation Python Backend (FastAPI) Interactive Docs:
http://localhost:8000/docs Alternative Docs: http://localhost:8000/redoc

Java Backend (Spring Boot) Health Check: http://localhost:8080/health
Actuator Endpoints: http://localhost:8080/actuator

Docker Configuration Building Individual Images # Python Backend docker
build -f docker/Dockerfile-python -t bookwise-python .

Java Backend

docker build -f docker/Dockerfile-java -t bookwise-java .

Frontend

docker build -f docker/Dockerfile-frontend -t bookwise-frontend .

Service Ports Frontend: 5173 Python Backend: 8000 Java Backend: 8080
PostgreSQL: 5432 MySQL: 3306

CI/CD Pipeline The project includes GitHub Actions workflow for:
Automated testing on pull requests Docker image building Dependency
vulnerability scanning

Engineering Decisions Documentation 1. Architectural Patterns
Domain-Driven Design Microservices Architecture Repository Pattern

2.  Technology Selection Rationale FastAPI Spring Boot React +
    TypeScript

3.  Database Design PostgreSQL for Library Data MySQL for Authentication

Troubleshooting Common Issues Database Connection Errors docker ps |
grep -E “(postgres|mysql)” docker-compose down -v docker-compose up -d
db mysql

Service Communication Issues docker-compose logs python-backend
docker-compose logs java-backend docker network inspect
final-project_default

Frontend Build Errors cd frontend rm -rf node_modules package-lock.json
npm cache clean –force npm install

Future Improvements API Gateway Implementation Message Queue Integration
Caching Layer Monitoring Stack Kubernetes Deployment

Development Team Wilder Steven Hernandez Manosalva - 20212020135 Jhon
Javier Castañeda Alvarado - 20211020100 Course: Software Engineering
Seminar University: Universidad Distrital Francisco José de Caldas
Academic Period: 2025-2

License This project is developed for academic purposes as part of the
Software Engineering course requirements.
