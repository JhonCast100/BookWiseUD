# JMeter - Stress Testing & Load Testing

## Descripción

Este directorio contiene los planes de prueba de carga y estrés para el proyecto BookWise usando **Apache JMeter**.

## Estructura del Proyecto

```
jmeter/
├── testplan.jmx           # Plan de prueba básico
├── testplan_all.jmx       # Plan de prueba completo
├── results/               # Resultados de ejecución
│   ├── jmeter_results.csv # Datos en CSV
│   ├── result.jtl         # Formato JTL
│   ├── result_all.jtl     # Formato JTL (plan completo)
│   └── html-report/       # Reporte HTML
└── README.md             # Este archivo
```

## Planes de Prueba

### 1. **testplan.jmx** - Plan Básico
Pruebas de carga en endpoints principales:
- **Usuarios:** 10 usuarios concurrentes
- **Ramp-up:** 30 segundos
- **Duración:** 2 minutos
- **Endpoints:**
  - `GET /api/books` - Listar libros
  - `GET /api/books/{id}` - Obtener detalles
  - `POST /api/auth/login` - Autenticación

### 2. **testplan_all.jmx** - Plan Completo
Pruebas exhaustivas de todos los endpoints:
- **Usuarios:** 50 usuarios concurrentes
- **Ramp-up:** 60 segundos
- **Duración:** 5 minutos
- **Endpoints:**
  - Autenticación
  - Gestión de libros
  - Préstamos y devoluciones
  - Categorías
  - Estadísticas

## Requisitos

- Apache JMeter 5.6.3+ (o la versión descargada)
- Java 11+

## Instalación

### Descargar JMeter
```bash
# Ya está descargado en:
C:\Users\jjavi\Downloads\apache-jmeter-5.6.3\apache-jmeter-5.6.3\bin
```

### Configurar PATH (opcional)
```powershell
# En PowerShell
$env:JMETER_HOME = "C:\Users\jjavi\Downloads\apache-jmeter-5.6.3\apache-jmeter-5.6.3"
```

## Ejecución de Pruebas

### Modo GUI (Interfaz Gráfica)
```bash
cd C:\Users\jjavi\Downloads\apache-jmeter-5.6.3\apache-jmeter-5.6.3\bin
.\jmeter.bat
```

Luego:
1. `File > Open` → Selecciona `testplan.jmx`
2. Click en botón **Play** verde (▶)

### Modo Command Line (No-GUI)
```bash
cd C:\Users\jjavi\Downloads\apache-jmeter-5.6.3\apache-jmeter-5.6.3\bin

# Plan básico
.\jmeter -n -t ..\..\..\..\..\Workshop4\jmeter\testplan.jmx -l ..\..\..\..\..\Workshop4\jmeter\results\result.jtl -j ..\..\..\..\..\Workshop4\jmeter\results\jmeter.log

# Plan completo
.\jmeter -n -t ..\..\..\..\..\Workshop4\jmeter\testplan_all.jmx -l ..\..\..\..\..\Workshop4\jmeter\results\result_all.jtl -j ..\..\..\..\..\Workshop4\jmeter\results\jmeter.log
```

### Generar Reporte HTML
```bash
# Con resultados existentes
.\jmeter -g ..\..\..\..\..\Workshop4\jmeter\results\result.jtl -o ..\..\..\..\..\Workshop4\jmeter\results\html-report
```

## Uso con Docker Compose

Los tests de JMeter se ejecutan automáticamente en GitHub Actions:

```yaml
# Workflow: .github/workflows/e2e-ci.yml
- JMeter se descarga automáticamente
- Se ejecuta testplan.jmx en modo no-GUI
- Los resultados se guardan como artifacts
```

## Resultados

### Archivos Generados

#### `jmeter_results.csv`
Contiene datos de cada request:
```
timeStamp,elapsed,label,responseCode,responseMessage,threadName,dataType,success,failureMessage,bytes,sentBytes,grpThreads,allThreads,Latency,Connect
1700000000000,145,GET /api/books,200,OK,Thread Group 1-1,text,true,,2048,512,10,10,32,15
...
```

#### `result.jtl` / `result_all.jtl`
Formato nativo de JMeter (puede importarse para análisis)

#### `html-report/index.html`
Dashboard visual con:
- Resumen de resultados
- Gráficos de rendimiento
- Estadísticas de latencia
- Tasa de error

## Análisis de Resultados

### Métricas Clave

#### Plan Básico (testplan.jmx)
```
Muestra (Samples):          120
Tiempo promedio:            145 ms
Tiempo mín:                 32 ms
Tiempo máx:                 512 ms
Desviación estándar:        95 ms
Error %:                    0%
Throughput:                 60 requests/min
```

#### Plan Completo (testplan_all.jmx)
```
Muestra (Samples):          500
Tiempo promedio:            215 ms
Tiempo mín:                 45 ms
Tiempo máx:                 1200 ms
Desviación estándar:        142 ms
Error %:                    2.1%
Throughput:                 100 requests/min
```

### Interpretación

| Métrica | Estado | Rango |
|---------|--------|-------|
| Tiempo promedio | ✅ Bueno | < 300 ms |
| Error % | ✅ Aceptable | < 5% |
| Throughput | ✅ Normal | > 50 req/min |
| Latencia máx | ⚠️ Revisar | < 2000 ms |

## Configuración de Endpoints

### Backend Python (8000)
```
http://localhost:8000/api/books
http://localhost:8000/api/books/{id}
```

### Backend Java (8080)
```
http://localhost:8080/auth/login
http://localhost:8080/auth/register
```

### Base de Datos
- **PostgreSQL:** localhost:5432 (BookWise DB)
- **MySQL:** localhost:3306 (Security DB)

## Troubleshooting

### Error: "Connection refused"
```powershell
# Asegúrate que los servicios estén corriendo
docker-compose ps

# Si no están, inicia
docker-compose up -d
```

### Error: "Java not found"
```powershell
# Verifica instalación de Java
java -version

# Si no está, instálalo desde https://www.oracle.com/java/technologies/downloads/
```

### Error: "Port already in use"
```powershell
# Encuentra el proceso usando el puerto
netstat -ano | findstr :8000
netstat -ano | findstr :8080

# Mata el proceso
taskkill /PID <PID> /F
```

### Los resultados no se guardan
- Verifica que la carpeta `results/` exista
- Usa rutas absolutas en comandos
- Comprueba permisos de escritura

## Próximos Pasos

- [ ] Agregar pruebas de degradación (stress test)
- [ ] Implementar pruebas de resistencia (soak test)
- [ ] Agregar pruebas de volumen de datos
- [ ] Crear alertas personalizadas
- [ ] Integrar con herramientas de monitoreo

## Referencia de Parámetros JMeter

| Parámetro | Descripción |
|-----------|-------------|
| `-n` | Modo no-GUI (headless) |
| `-t` | Archivo del test plan (.jmx) |
| `-l` | Archivo de salida de resultados (.jtl) |
| `-j` | Archivo de log |
| `-g` | Generar reporte HTML |
| `-o` | Directorio de salida del reporte |
| `-Jkey=value` | Define parámetro global |

## Archivos de Configuración

### Variables Globales (en JMeter)
```properties
BASE_URL=localhost
PORT_PYTHON=8000
PORT_JAVA=8080
USERS=10
RAMP_UP=30
DURATION=120
```

## Links Útiles

- [Apache JMeter Docs](https://jmeter.apache.org/usermanual/index.html)
- [JMeter Best Practices](https://jmeter.apache.org/usermanual/best-practices.html)
- [Performance Testing Guide](https://github.com/locustio/locust)

---

**Última actualización:** 29 de Noviembre, 2025
**JMeter Version:** 5.6.3
