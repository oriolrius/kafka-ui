# Dev Environment Skill

Start the complete development environment for Kafbat UI.

## What it does:
1. Checks if backend is already running
2. Checks if frontend is already running
3. Provides instructions to start both services
4. Verifies health after startup

## Usage:
This skill provides step-by-step instructions to start the full dev environment.

## Implementation:

Check backend status:
```bash
curl -s http://localhost:51080/actuator/health 2>/dev/null && echo "Backend is running" || echo "Backend is not running"
```

Check frontend status:
```bash
curl -s http://localhost:51081 2>/dev/null && echo "Frontend is running" || echo "Frontend is not running"
```

If services are not running, instruct user to start them in separate terminals:

**Terminal 1 - Backend:**
```bash
just backend
```

**Terminal 2 - Frontend:**
```bash
just frontend
```

After services start, verify:
- Backend health: `http://localhost:51080/actuator/health`
- Frontend: `http://localhost:51081`

## Quick Start Guide:
```bash
# First time setup (if needed)
cd frontend && pnpm install

# Terminal 1: Start backend
just backend

# Terminal 2: Start frontend
just frontend

# Access UI at http://localhost:51081
```
