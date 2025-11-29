# Workshop4 - Deployment, Acceptance and Stress Testing (English)

This folder contains artifacts and instructions to run the Dockerized services, Cucumber acceptance tests, JMeter stress tests and a CI workflow.

Prerequisites
- Docker and Docker Compose installed
- GitHub Actions runs on push to `main` for build automation
- For local Python testing: Python 3.11 and `pip`

Services (locations)
- Java backend: `Code/BackendAuthentication` (Spring Boot, Java 17)
- Python backend: `Code/Backend` (FastAPI, Uvicorn)
- Frontend: `Code/Frontend` (Vite, production served with nginx)

How to run locally with Docker Compose
1. From this repository root run:

```powershell
cd Workshop4
docker-compose up --build
```

2. Endpoints (after containers start):
- Java auth: `http://localhost:8080`
- Python API: `http://localhost:8000`
- Frontend (served): `http://localhost:5173` (mapped to nginx container port 80)

Cucumber Acceptance Tests (Behave)
- Features are under `Workshop4/cucumber/features`
- Steps are under `Workshop4/cucumber/features/steps`
- To run locally (requires Python & `behave`):

```powershell
cd Workshop4/cucumber
python -m pip install -r requirements.txt
behave -f pretty -o results/cucumber_run.txt
```

JMeter Stress Tests
- Test plan: `Workshop4/jmeter/testplan.jmx`
- Results CSV: `Workshop4/jmeter/results/jmeter_results.csv`
- To run a GUI or non-GUI test (example non-GUI):

```powershell
cd Workshop4/jmeter
"C:\Program Files\Apache\jmeter\bin\jmeter.bat" -n -t testplan.jmx -l results/jmeter_results.csv
```

GitHub Actions CI
- Workflow file: `.github/workflows/ci.yml`
- It runs on push or pull_request to `main` and executes Python tests, builds the Java package and attempts to build Docker images.

Evidence / Results included
- Cucumber example run: `Workshop4/cucumber/results/cucumber_run.txt`
- JMeter example results: `Workshop4/jmeter/results/jmeter_results.csv`
- Note: Full acceptance tests (behave) and stress tests assume the services are reachable at the mapped ports.

Notes and next steps
- The Dockerfiles were added to the canonical service folders: `Code/BackendAuthentication/Dockerfile`, `Code/Backend/Dockerfile`, `Code/Frontend/Dockerfile`.
- CI workflow builds images but does not push to a registry by default. Adjust `docker/build-push-action` settings to push images to GHCR or Docker Hub.

If you want, I can:
- Run the Python unit tests here and attach the output
- Run behave locally and save the run output (requires network access to services)
- Adjust CI to run acceptance tests inside a docker-compose environment
# BookWise Workshop4 - Deliverables

This repository contains Dockerfiles, a docker-compose configuration, Cucumber acceptance tests (Behave), a JMeter test plan, a GitHub Actions CI/CD workflow, and sample results.

How to run the services (local)

- Build and start services with docker-compose:

```powershell
docker-compose up --build
```

Services:
- Java backend: `http://localhost:8080`
- Python backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

Cucumber (Behave) acceptance tests

1. Install dependencies:

```powershell
python -m pip install -r cucumber/requirements.txt
```

2. Run tests (ensure services are up):

```powershell
cd cucumber
behave
```

Results will be written to `cucumber/results/cucumber_run.txt` when using the CI run command.

JMeter stress tests

1. Open `jmeter/testplan.jmx` in Apache JMeter GUI.
2. Run the test plan against the running API (it targets `http://localhost:8000/api/auth/login`).
3. Save results as CSV or HTML in `jmeter/results/`.

GitHub Actions pipeline

- Workflow file: `.github/workflows/ci-cd.yml`.
- On push to `main` it installs test dependencies and runs Behave acceptance tests, then builds Docker images for the three components.

Evidences (sample)

- `cucumber/results/cucumber_run.txt` - sample behave output.
- `jmeter/results/jmeter_results.csv` - sample JMeter CSV output.

Notes and assumptions

- The backends must expose the documented endpoints. The example Cucumber scenario posts to `/api/auth/login` on port 8000 (Python backend). Adjust `cucumber/features/steps/login_steps.py` if your API runs on a different port or path.
- Dockerfiles are located in `docker/` as `Dockerfile-python`, `Dockerfile-java`, `Dockerfile-frontend`.

- New feature templates were added under `cucumber/features/`:
	- `register.feature`, `books.feature`, `book_management.feature`, `borrow_return.feature`.
	- Generic HTTP step implementations: `cucumber/features/steps/http_steps.py` which uses `requests` and assumes `http://localhost:8000` as base.


References

- Docker Compose: https://docs.docker.com/compose/
- Behave (Cucumber for Python): https://behave.readthedocs.io/
- Apache JMeter: https://jmeter.apache.org/
