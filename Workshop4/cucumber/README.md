# Cucumber - Acceptance Testing

## Description

This directory contains the acceptance tests for the BookWise project using **Behave** (Cucumber implementation for Python).

## Project Structure

```
cucumber/
├── features/              # Feature files with user stories
│   ├── login.feature
│   ├── register.feature
│   ├── books.feature
│   ├── book_management.feature
│   ├── borrow_return.feature
│   └── steps/             # Step definitions (implementation of steps)
├── results/               # Execution results
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## Implemented Features

### 1. **login.feature** - User Authentication
- ✅ Successful login with valid credentials
- ✅ Returns JWT token

### 2. **register.feature** - New User Registration
- ✅ User registration with valid information
- ✅ Strong password validation
- ✅ Unique email

### 3. **books.feature** - Book Query
- ✅ List all available books
- ✅ Get details of a specific book

### 4. **book_management.feature** - Book Management
- ✅ Create new book (Admin)
- ✅ Update book information
- ✅ Delete book

### 5. **borrow_return.feature** - Borrowing and Returning
- ✅ Borrow a book
- ✅ Return a borrowed book
- ✅ Validate availability

## Installation and Configuration

### Prerequisites
- Python 3.11+
- pip

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Installed Dependencies
```
behave          # Cucumber framework
behave-html-formatter  # HTML report generator
requests        # HTTP client for testing
```

## Running Tests

### Run all tests
```bash
behave
```

### Run specific feature
```bash
behave features/login.feature
```

### Run with specific format
```bash
# Plain format (simple)
behave -f plain

# Pretty format (more readable)
behave -f pretty

# JSON format (for processing)
behave -f json
```

### Generate HTML report
```bash
behave -f html -o results/report.html
```

## Usage with Docker Compose

Tests run automatically when docker-compose starts:

```bash
docker-compose up
# Tests will run in the GitHub Actions workflow
```

## Execution Evidence

### Latest Executions

#### Local Execution (29/11/2025)
```
Status: PASSED ✅
Total Scenarios: 11
Passed: 11
Failed: 0
Skipped: 0
Duration: ~45 seconds
```

#### Tested Endpoints
- `POST /api/auth/login` - ✅ Functional
- `POST /api/auth/register` - ✅ Functional
- `GET /api/books` - ✅ Functional
- `GET /api/books/{id}` - ✅ Functional
- `POST /api/books` (Admin) - ✅ Functional
- `PUT /api/books/{id}` - ✅ Functional
- `DELETE /api/books/{id}` - ✅ Functional
- `POST /api/loans` - ✅ Functional
- `PUT /api/loans/{id}/return` - ✅ Functional

## Results

Test results are saved in:
- `results/cucumber_run.txt` - Plain text output
- `results/cucumber_run.json` - JSON output

## Error Logs

If there are errors, they are saved in:
- `results/cucumber_junit_err.log` - Error log

## GitHub Actions CI/CD

Tests run automatically on each push to `main`:

```yaml
# Workflow: .github/workflows/e2e-ci.yml
- Services (Docker Compose) are started
- Wait 30 seconds for services to be ready
- Run behave tests
- Save results as artifacts
```

## Successful Test Cases

### Authentication
- ✅ User can login with valid credentials
- ✅ JWT token is returned correctly
- ✅ User can register with valid email

### Books
- ✅ List books returns valid array
- ✅ Get book details returns object with title
- ✅ Admin can create new book
- ✅ Admin can update existing book
- ✅ Admin can delete book

### Loans
- ✅ User can borrow a book
- ✅ User can return borrowed book
- ✅ System validates availability

## Troubleshooting

### Error: "No module named 'behave'"
```bash
pip install -r requirements.txt
```

### Error: "Connection refused"
Make sure services are running:
```bash
docker-compose up -d
docker-compose ps
```

### Error: "BAD_FORMAT=junit"
Use supported formats: `plain`, `pretty`, `json`

## Next Steps

- [ ] Add data validation tests
- [ ] Add negative test cases
- [ ] Implement performance tests
- [ ] Add security coverage

## References

- [Behave Documentation](https://behave.readthedocs.io/)
- [Gherkin Syntax](https://cucumber.io/docs/gherkin/)
- [Python Requests](https://requests.readthedocs.io/)

---

**Last updated:** November 29, 2025
