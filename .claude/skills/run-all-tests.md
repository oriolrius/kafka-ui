# Run All Tests Skill

Execute the complete test suite for Kafbat UI (backend + frontend).

## What it does:
1. Runs backend tests (JUnit + integration tests)
2. Runs frontend tests (Jest)
3. Reports test results and coverage
4. Identifies failures

## Usage:
Run this skill before committing code or creating a PR.

## Implementation:

### Backend Tests
```bash
# Run all backend tests
./gradlew :api:test

# Check exit code
if [ $? -eq 0 ]; then
  echo "✅ Backend tests passed"
else
  echo "❌ Backend tests failed"
  exit 1
fi
```

### Frontend Tests
```bash
# Run frontend tests (CI mode)
cd frontend && pnpm test:CI

# Check exit code
if [ $? -eq 0 ]; then
  echo "✅ Frontend tests passed"
else
  echo "❌ Frontend tests failed"
  exit 1
fi
```

### Code Quality Checks
```bash
# Backend checkstyle
./gradlew :api:checkstyleMain
if [ $? -eq 0 ]; then
  echo "✅ Checkstyle passed"
else
  echo "❌ Checkstyle failed"
  exit 1
fi

# Frontend lint
cd frontend && pnpm lint
if [ $? -eq 0 ]; then
  echo "✅ ESLint passed"
else
  echo "❌ ESLint failed"
  exit 1
fi

# Frontend type check
cd frontend && pnpm tsc --noEmit
if [ $? -eq 0 ]; then
  echo "✅ Type check passed"
else
  echo "❌ Type check failed"
  exit 1
fi
```

## Quick Command:
```bash
# Run everything
./gradlew :api:test && \
./gradlew :api:checkstyleMain && \
cd frontend && pnpm test:CI && pnpm lint && pnpm tsc --noEmit
```

## Coverage Reports:
- Backend: `api/build/reports/tests/test/index.html`
- Frontend: `frontend/coverage/lcov-report/index.html`
