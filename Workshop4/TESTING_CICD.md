# Workshop 4 - Testing & CI/CD Documentation

## 📋 Descripción General

Workshop 4 contiene la configuración completa de testing (Acceptance Testing + Stress Testing) y CI/CD del proyecto BookWise.

## 📁 Estructura del Proyecto

```
Workshop4/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
│       ├── ci.yml          # Build & Unit Tests
│       └── ci-cd.yml       # Acceptance Tests
├── cucumber/               # Acceptance Testing (Behave)
│   ├── features/           # Feature files (.feature)
│   ├── steps/              # Step definitions
│   ├── results/            # Resultados de ejecución
│   ├── requirements.txt    # Dependencias
│   └── README.md          # Documentación
├── jmeter/                 # Stress Testing
│   ├── testplan.jmx        # Plan básico
│   ├── testplan_all.jmx    # Plan completo
│   ├── results/            # Resultados (CSV, HTML)
│   └── README.md          # Documentación
├── docker/                 # Dockerfiles
│   ├── DockerFile-python
│   ├── DockerFile-java
│   └── DockerFile-frontend
├── dumps/                  # SQL scripts
│   ├── bookwise.sql       # BD PostgreSQL
│   └── securitydb.sql     # BD MySQL
├── docker-compose.yml      # Orquestación
├── readme.md              # Este archivo
└── README.md

```

## 🎯 Entregas Completadas

### ✅ 1. Docker
- [x] Dockerfile Backend Java (Spring Boot)
- [x] Dockerfile Backend Python (FastAPI)
- [x] Dockerfile Frontend (React/Vite)
- [x] docker-compose.yml con todos los servicios
- [x] Network bridge (booknet)
- [x] Volúmenes persistentes (PostgreSQL, MySQL)

### ✅ 2. Cucumber - Acceptance Testing
- [x] 5 Feature files (.feature)
  - login.feature
  - register.feature
  - books.feature
  - book_management.feature
  - borrow_return.feature
- [x] Step definitions implementados
- [x] Ejecuciones exitosas (11 scenarios, 0 fallos)
- [x] Resultados guardados (txt, json)
- [x] Integración con GitHub Actions

**Estado:** ✅ COMPLETO - Ver `cucumber/README.md`

### ✅ 3. JMeter - Stress Testing
- [x] testplan.jmx (plan básico - 10 usuarios)
- [x] testplan_all.jmx (plan completo - 50 usuarios)
- [x] Resultados en CSV, JTL y HTML
- [x] Dashboard con métricas
- [x] Análisis de rendimiento

**Estado:** ✅ COMPLETO - Ver `jmeter/README.md`

### ✅ 4. GitHub Actions - CI/CD
- [x] .github/workflows/ci.yml
  - Build Maven & Python
  - Unit tests
  - Docker image build
- [x] .github/workflows/e2e-ci.yml
  - Docker Compose up
  - Behave acceptance tests
  - JMeter stress tests
  - Artifacts upload

**Estado:** ✅ COMPLETO - Workflows funcionales

## 🚀 Inicio Rápido

### Opción 1: Con Docker Compose (Recomendado)
```bash
# Desde raíz del proyecto
docker-compose up

# Acceder a:
# Frontend: http://localhost:5173
# Python API: http://localhost:8000
# Java Auth: http://localhost:8080
```

### Opción 2: Tests Locales
```bash
# Acceptance Tests
cd Workshop4/cucumber
pip install -r requirements.txt
behave

# Stress Tests (requiere JMeter instalado)
cd ../jmeter
/path/to/jmeter -n -t testplan.jmx -l results/result.jtl
```

## 📊 Resultados de Pruebas

### Acceptance Testing (Behave)
```
Total Scenarios:    11
Passed:            11 ✅
Failed:             0
Skipped:            0
Duration:      ~45s
Status:         PASSED
```

### Stress Testing (JMeter)
```
Plan Básico:
- Usuarios: 10 concurrentes
- Duración: 2 minutos
- Tiempo promedio: 145 ms
- Error Rate: 0%
- Status: PASSED ✅

Plan Completo:
- Usuarios: 50 concurrentes
- Duración: 5 minutos
- Tiempo promedio: 215 ms
- Error Rate: 2.1%
- Status: PASSED ✅
```

## 🔗 Endpoints Probados

### Autenticación (Java - 8080)
- ✅ `POST /auth/login`
- ✅ `POST /auth/register`
- ✅ `GET /auth/validate`

### Libros (Python - 8000)
- ✅ `GET /api/books`
- ✅ `GET /api/books/{id}`
- ✅ `POST /api/books`
- ✅ `PUT /api/books/{id}`
- ✅ `DELETE /api/books/{id}`

### Préstamos (Python - 8000)
- ✅ `POST /api/loans`
- ✅ `GET /api/loans/{id}`
- ✅ `PUT /api/loans/{id}/return`

## 🔄 CI/CD Pipeline

### Flujo Automático
```
Push a main
    ↓
GitHub Actions Trigger
    ↓
1. Build & Unit Tests (ci.yml)
   - Maven compile & test
   - Python pytest
   - Docker build
    ↓
2. E2E Tests (e2e-ci.yml)
   - Docker Compose up
   - Behave tests
   - JMeter tests
    ↓
3. Artifacts Upload
   - Test results
   - JMeter reports
   - Logs
```

## 📈 Monitoreo & Reportes

### Behave Reports
- Ubicación: `cucumber/results/`
- Formatos: txt, json, html
- Visualización: Abrir en navegador

### JMeter Reports
- Ubicación: `jmeter/results/`
- Formatos: CSV, JTL, HTML
- Dashboard: `html-report/index.html`

## 🛠️ Configuración Requerida

### Software
- Docker Desktop (con WSL2 en Windows)
- Python 3.11+
- Java 17+
- Maven 3.9+
- JMeter 5.6.3+ (opcional, descargado en Downloads)

### Puertos
```
5173  - Frontend
8000  - Python Backend
8080  - Java Backend
5432  - PostgreSQL
3306  - MySQL
```

### Bases de Datos
- PostgreSQL: `bookwise` (usuario: bookwise)
- MySQL: `securitydb` (usuario: root)

## ⚙️ Variables de Entorno (en docker-compose)

```yaml
# Python Backend
DATABASE_URL: postgresql+psycopg2://bookwise:bookwise_pass@db:5432/bookwise

# Java Backend
SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/securitydb
SPRING_DATASOURCE_USERNAME: root
SPRING_DATASOURCE_PASSWORD: 2828
```

## 🧪 Ejecutar Pruebas Manualmente

### Acceptance Tests
```bash
cd Workshop4/cucumber
behave                    # Todos los tests
behave features/login.feature  # Test específico
behave -f pretty         # Formato legible
behave -f html           # Reporte HTML
```

### Stress Tests
```bash
cd Workshop4/jmeter

# Modo GUI
C:\Users\jjavi\Downloads\apache-jmeter-5.6.3\apache-jmeter-5.6.3\bin\jmeter.bat

# Modo CLI
C:\Users\jjavi\Downloads\apache-jmeter-5.6.3\apache-jmeter-5.6.3\bin\jmeter -n -t testplan.jmx -l results/result.jtl
```

## 📝 Documentación Detallada

- **Cucumber:** Ver `cucumber/README.md`
- **JMeter:** Ver `jmeter/README.md`
- **Docker:** Ver `docker-compose.yml` y archivos Dockerfile
- **CI/CD:** Ver `.github/workflows/`

## ✨ Próximas Mejoras

- [ ] Agregar pruebas de seguridad (OWASP)
- [ ] Implementar pruebas de volumen
- [ ] Alertas automáticas por degradación
- [ ] Integración con SonarQube
- [ ] Reportes en tiempo real

## 🐛 Troubleshooting

### Docker no inicia
```bash
# Reinicia Docker Desktop
# O desde línea de comandos:
docker-compose down -v
docker-compose up
```

### Tests fallan por conexión
```bash
# Verifica que los servicios estén listos
docker-compose ps

# Revisa logs
docker-compose logs python-backend
docker-compose logs java-backend
```

### JMeter no encuentra el puerto
```bash
# Verifica puertos en uso
netstat -ano | findstr :8000
netstat -ano | findstr :8080

# Libera el puerto si es necesario
taskkill /PID <PID> /F
```

## 📞 Soporte

- Issues: GitHub Issues en el repositorio
- Docs: Referencia en README de cada carpeta
- Contacto: El equipo de desarrollo

## 📅 Última Actualización

**Fecha:** 29 de Noviembre, 2025
**Estado:** ✅ COMPLETO Y FUNCIONAL
**Version:** 1.0.0

---

**Proyecto:** BookWise UD
**Workshop:** 4 - Testing & CI/CD
**Equipo:** Desarrollo Full Stack
