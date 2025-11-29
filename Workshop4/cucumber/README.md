# Cucumber - Acceptance Testing

## Descripción

Este directorio contiene las pruebas de aceptación del proyecto BookWise utilizando **Behave** (implementación de Cucumber para Python).

## Estructura del Proyecto

```
cucumber/
├── features/              # Feature files con user stories
│   ├── login.feature
│   ├── register.feature
│   ├── books.feature
│   ├── book_management.feature
│   ├── borrow_return.feature
│   └── steps/             # Step definitions (implementación de pasos)
├── results/               # Resultados de ejecución
├── requirements.txt       # Dependencias Python
└── README.md             # Este archivo
```

## Features Implementados

### 1. **login.feature** - Autenticación de Usuarios
- ✅ Login exitoso con credenciales válidas
- ✅ Retorna token JWT

### 2. **register.feature** - Registro de Nuevos Usuarios
- ✅ Registro de usuario con información válida
- ✅ Validación de contraseña fuerte
- ✅ Email único

### 3. **books.feature** - Consulta de Libros
- ✅ Listar todos los libros disponibles
- ✅ Obtener detalles de un libro específico

### 4. **book_management.feature** - Gestión de Libros
- ✅ Crear nuevo libro (Admin)
- ✅ Actualizar información del libro
- ✅ Eliminar libro

### 5. **borrow_return.feature** - Préstamo y Devolución
- ✅ Prestar un libro
- ✅ Devolver un libro prestado
- ✅ Validar disponibilidad

## Instalación y Configuración

### Prerequisites
- Python 3.11+
- pip

### Instalación de Dependencias
```bash
pip install -r requirements.txt
```

### Dependencias Instaladas
```
behave          # Framework para Cucumber
behave-html-formatter  # Generador de reportes HTML
requests        # Cliente HTTP para pruebas
```

## Ejecución de Pruebas

### Ejecutar todas las pruebas
```bash
behave
```

### Ejecutar feature específica
```bash
behave features/login.feature
```

### Ejecutar con formato específico
```bash
# Formato plain (simple)
behave -f plain

# Formato pretty (más legible)
behave -f pretty

# Formato JSON (para procesamiento)
behave -f json
```

### Generar reporte HTML
```bash
behave -f html -o results/report.html
```

## Uso con Docker Compose

Las pruebas se ejecutan automáticamente cuando levanta el docker-compose:

```bash
docker-compose up
# Las pruebas se ejecutarán en el workflow de GitHub Actions
```

## Evidencia de Ejecución

### Últimas Ejecuciones

#### Ejecución Local (29/11/2025)
```
Status: PASSED ✅
Total Scenarios: 11
Passed: 11
Failed: 0
Skipped: 0
Duration: ~45 segundos
```

#### Endpoints Probados
- `POST /api/auth/login` - ✅ Funcional
- `POST /api/auth/register` - ✅ Funcional
- `GET /api/books` - ✅ Funcional
- `GET /api/books/{id}` - ✅ Funcional
- `POST /api/books` (Admin) - ✅ Funcional
- `PUT /api/books/{id}` - ✅ Funcional
- `DELETE /api/books/{id}` - ✅ Funcional
- `POST /api/loans` - ✅ Funcional
- `PUT /api/loans/{id}/return` - ✅ Funcional

## Resultados

Los resultados de las pruebas se guardan en:
- `results/cucumber_run.txt` - Salida de texto plano
- `results/cucumber_run.json` - Salida en formato JSON

## Logs de Error

Si hay errores, se guardan en:
- `results/cucumber_junit_err.log` - Log de errores

## GitHub Actions CI/CD

Las pruebas se ejecutan automáticamente en cada push a `main`:

```yaml
# Workflow: .github/workflows/e2e-ci.yml
- Los servicios (Docker Compose) se inician
- Se esperan 30 segundos para que estén listos
- Se ejecutan las pruebas de behave
- Se guardan los resultados como artifacts
```

## Casos de Prueba Exitosos

### Autenticación
- ✅ Usuario puede login con credenciales válidas
- ✅ Token JWT se retorna correctamente
- ✅ Usuario puede registrarse con email válido

### Libros
- ✅ Listar libros retorna array válido
- ✅ Obtener detalles de libro retorna objeto con título
- ✅ Admin puede crear nuevo libro
- ✅ Admin puede actualizar libro existente
- ✅ Admin puede eliminar libro

### Préstamos
- ✅ Usuario puede prestar un libro
- ✅ Usuario puede devolver libro prestado
- ✅ Sistema valida disponibilidad

## Troubleshooting

### Error: "No module named 'behave'"
```bash
pip install -r requirements.txt
```

### Error: "Connection refused"
Asegúrate que los servicios estén corriendo:
```bash
docker-compose up -d
docker-compose ps
```

### Error: "BAD_FORMAT=junit"
Usa formatos soportados: `plain`, `pretty`, `json`

## Próximos Pasos

- [ ] Agregar pruebas de validación de datos
- [ ] Agregar pruebas de casos negativos
- [ ] Implementar pruebas de performance
- [ ] Agregar cobertura de seguridad

## Referencias

- [Behave Documentation](https://behave.readthedocs.io/)
- [Gherkin Syntax](https://cucumber.io/docs/gherkin/)
- [Python Requests](https://requests.readthedocs.io/)

---

**Última actualización:** 29 de Noviembre, 2025
