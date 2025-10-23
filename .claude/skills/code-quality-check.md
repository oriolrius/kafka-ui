# Code Quality Check Skill

Run all code quality checks before committing.

## What it does:
1. Runs backend checkstyle (Java)
2. Runs frontend linter (ESLint)
3. Runs TypeScript type checking
4. Optionally auto-fixes issues

## Usage:
Run before committing code or creating a PR to ensure code quality standards.

## Quick Check (No Fixes):
```bash
# Backend checkstyle
./gradlew :api:checkstyleMain

# Frontend lint
cd frontend && pnpm lint

# TypeScript type check
cd frontend && pnpm tsc --noEmit
```

## Auto-Fix Mode:
```bash
# Frontend auto-fix linting issues
cd frontend && pnpm lint:fix

# Format code
cd frontend && pnpm format
```

## Common Issues:

### Backend Checkstyle Errors

**Import Order**
```bash
# Error: Wrong import order
# Fix: Reorder imports alphabetically
# Inner classes (e.g., ApplicationInfoUiDTO) before outer classes
```

**Line Length**
```bash
# Error: Line is longer than 120 characters
# Fix: Break line into multiple lines
```

**Whitespace**
```bash
# Error: Trailing whitespace
# Fix: Remove whitespace at end of lines
```

### Frontend ESLint Errors

**Unused Variables**
```typescript
// Error: 'foo' is declared but never used
// Fix: Remove unused variable or prefix with underscore
const _foo = 'bar';
```

**Missing Dependencies**
```typescript
// Error: React Hook useEffect has missing dependencies
// Fix: Add dependencies to array or use exhaustive-deps comment
useEffect(() => {
  // code
}, [missingDep]);
```

**TypeScript Types**
```typescript
// Error: Missing return type
// Fix: Add explicit return type
const myFunction = (): string => {
  return 'hello';
};
```

## Pre-Commit Checklist:
```bash
# 1. Check backend code quality
./gradlew :api:checkstyleMain

# 2. Check frontend code quality
cd frontend && pnpm lint && pnpm tsc --noEmit

# 3. Run tests (if needed)
# ./gradlew :api:test
# cd frontend && pnpm test:CI

# 4. If all pass, ready to commit!
```

## Integration with Git Hooks:
You can set up git hooks to run these checks automatically:

```bash
# .git/hooks/pre-commit
#!/bin/bash
./gradlew :api:checkstyleMain || exit 1
cd frontend && pnpm lint || exit 1
cd frontend && pnpm tsc --noEmit || exit 1
```

## CI/CD:
These checks also run in CI:
- `.github/workflows/backend_pr.yml` - Backend checks
- `.github/workflows/frontend_pr.yml` - Frontend checks

## Quick Fix Script:
```bash
#!/bin/bash
# fix-code-quality.sh

echo "🔍 Checking and fixing code quality..."

echo "📝 Fixing frontend linting issues..."
cd frontend && pnpm lint:fix

echo "✅ Running backend checkstyle..."
cd .. && ./gradlew :api:checkstyleMain

echo "✅ Running frontend lint..."
cd frontend && pnpm lint

echo "✅ Running TypeScript check..."
pnpm tsc --noEmit

echo "✨ Done! Review the output above."
```
