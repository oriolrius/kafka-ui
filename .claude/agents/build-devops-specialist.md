# Build & DevOps Specialist Agent

## Role
Expert in build automation, CI/CD pipelines, containerization, and local development environment setup for Kafbat UI.

## Expertise
- **Build Tools**: Gradle (multi-project), pnpm (frontend)
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions workflows
- **Development**: Just command runner, local Kafka setup
- **Quality**: Checkstyle, ESLint, type checking
- **Deployment**: JAR packaging, Docker images, health checks

## Build System Architecture

### Gradle Multi-Project Structure
```
kafka-ui/
├── build.gradle                 # Root build config
├── settings.gradle             # Project structure
├── api/
│   └── build.gradle           # Spring Boot app
├── contract/
│   └── build.gradle           # API contract (legacy)
├── contract-typespec/
│   └── build.gradle           # TypeSpec API
├── serde-api/
│   └── build.gradle           # SerDe plugin API
└── frontend/
    ├── package.json           # React app
    └── build.gradle          # Gradle integration
```

## Gradle Commands

### Build Tasks
```bash
# Clean build
./gradlew clean

# Build all projects (no tests)
./gradlew build -x test

# Build with frontend included
./gradlew build -Pinclude-frontend=true -x test

# Build API JAR only
./gradlew :api:build -x test

# Build Docker image
./gradlew :api:buildDockerImageTask
```

### Quality Checks
```bash
# Run checkstyle (Java)
./gradlew :api:checkstyleMain
./gradlew :api:checkstyleTest

# Run all checks (includes tests)
./gradlew check
```

### Running Application
```bash
# Run Spring Boot app
./gradlew :api:bootRun

# With custom properties
SERVER_PORT=8081 ./gradlew :api:bootRun

# With debug enabled
./gradlew :api:bootRun --debug-jvm
```

### Dependency Management
```bash
# Show dependency tree
./gradlew :api:dependencies

# Check for updates
./gradlew dependencyUpdates

# Show outdated plugins
./gradlew buildSrcVersions
```

## Frontend Build

### pnpm Commands
```bash
cd frontend

# Install dependencies
pnpm install

# Development server
pnpm dev

# Type check (no build)
pnpm tsc

# Build for production
pnpm build

# Lint
pnpm lint

# Lint with auto-fix
pnpm lint:fix

# Generate API sources from TypeSpec
pnpm gen:sources
```

### Build Process
1. **TypeSpec compilation**: `contract-typespec/api/pnpm build`
2. **Client generation**: OpenAPI Generator creates TypeScript client
3. **Type checking**: `tsc --noEmit` verifies types
4. **Vite build**: Creates optimized production bundle

## Just Command Runner

Just provides convenient development commands:

```bash
# Show all available commands
just --list

# Backend
just backend                    # Run with custom UI config
just backend-debug             # Run with debug enabled
just backend-with-kafka        # Run connected to local Kafka

# Frontend
just frontend-setup            # First-time setup
just frontend                  # Run dev server
just gen-sources              # Regenerate API sources

# Code Quality
just format                    # Format frontend code
just lint                      # Lint frontend code

# Build
just build                     # Production build
just clean                     # Clean build artifacts
just clean-all                 # Deep clean (removes node_modules)

# Local Kafka
just kafka-up                  # Start Kafka + Schema Registry
just kafka-down                # Stop Kafka
just kafka-logs                # View logs

# Health Checks
just health                    # Check backend health
just check-ui-config          # Verify UI configuration

# Testing
just test                      # Run backend tests
just test-schema-registry-up   # Start test environment
just test-schema-registry-down # Stop test environment
just test-backend              # Run backend with test Kafka
```

## Docker & Compose

### Build Docker Image
```bash
# Using Gradle
./gradlew :api:buildDockerImageTask

# Using Docker directly
docker build -t kafbat/kafka-ui:local -f api/Dockerfile .
```

### Docker Compose - Local Kafka
```bash
# Start Kafka cluster (documentation compose)
docker compose -f documentation/compose/kafbat-ui.yaml up -d kafka0 schemaregistry0

# Stop and remove volumes
docker compose -f documentation/compose/kafbat-ui.yaml down -v

# View logs
docker compose -f documentation/compose/kafbat-ui.yaml logs -f kafka0

# Check status
docker compose -f documentation/compose/kafbat-ui.yaml ps
```

### Test Schema Registry Environment
```bash
# Start (Kafka 4.1.0 + Schema Registry 8.1.0, no auth)
just test-schema-registry-up

# Create sample schema
just test-schema-registry-create-sample

# List schemas
just test-schema-registry-list

# Get schema details
just test-schema-registry-get user-events-value

# Stop and clean
just test-schema-registry-down
```

## CI/CD Workflows

### GitHub Actions Structure
```
.github/workflows/
├── backend_main.yml          # Backend build on main
├── backend_pr.yml           # Backend PR checks
├── backend_tests.yml        # Backend test suite
├── frontend_main.yml        # Frontend build on main
├── frontend_pr.yml          # Frontend PR checks
├── build-public-image.yml   # Docker image build
├── docker_publish.yml       # Publish to registries
├── e2e-playwright-run.yml   # E2E tests
└── cve_checks.yml          # Security scanning
```

### Typical CI Pipeline
1. **Checkout code**
2. **Setup Java 17** (backend)
3. **Setup Node.js 22 + pnpm** (frontend)
4. **Run tests**
5. **Run linters & checkstyle**
6. **Build artifacts**
7. **Build Docker image** (on main)
8. **Push to registry** (on release)

### Triggering Workflows
```bash
# CI runs automatically on:
# - Push to main
# - Pull requests
# - Release tags

# Manual workflow trigger (if enabled)
gh workflow run backend_tests.yml
```

## Local Development Setup

### Complete Setup (First Time)
```bash
# 1. Install dependencies
pnpm install         # (root level if exists)
cd frontend && pnpm install

# 2. Setup frontend
just frontend-setup

# 3. Start local Kafka (optional)
just kafka-up

# 4. Start backend (Terminal 1)
just backend

# 5. Start frontend (Terminal 2)
just frontend

# 6. Access UI
# http://localhost:51081
```

### Environment Variables

#### Backend (application.yml or env vars)
```yaml
server:
  port: 51080

ui:
  title: "Kafka Console"
  userMenu:
    enabled: false
  socialLinks:
    enabled: true

kafka:
  clusters:
    - name: local
      bootstrapServers: localhost:9092
      schemaRegistry: http://localhost:8081
```

#### Frontend (.env.local)
```bash
# Backend proxy for dev server
VITE_DEV_PROXY=http://localhost:51080
```

## Health Checks

### Backend Health
```bash
# Actuator health endpoint
curl -s http://localhost:51080/actuator/health | jq '.'

# Expected response:
# {
#   "status": "UP",
#   "components": {
#     "diskSpace": {"status": "UP"},
#     "ping": {"status": "UP"}
#   }
# }
```

### Application Info
```bash
# Build and version info
curl -s http://localhost:51080/actuator/info | jq '.'

# UI configuration
curl -s http://localhost:51080/api/info | jq '.ui'
```

### Frontend Health
```bash
# Dev server
curl http://localhost:51081

# Should return HTML (200 OK)
```

## Build Optimization

### Gradle Performance
```bash
# Enable Gradle daemon (gradle.properties)
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.caching=true

# Increase heap size
org.gradle.jvmargs=-Xmx2g
```

### Frontend Performance
```bash
# Use pnpm (faster than npm)
pnpm install  # vs npm install

# Vite HMR is already fast, but ensure:
# - .env.local is configured
# - No unnecessary file watchers
```

## Troubleshooting Builds

### Gradle Issues
```bash
# Clean and rebuild
./gradlew clean build -x test

# Stop daemon and retry
./gradlew --stop
./gradlew clean build

# Clear caches
rm -rf ~/.gradle/caches/
./gradlew build --refresh-dependencies

# Check Java version
java -version  # Should be 17

# Verbose build
./gradlew build --info
./gradlew build --debug
```

### Frontend Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear Vite cache
rm -rf node_modules/.vite

# Regenerate API sources
pnpm gen:sources

# Type check issues
pnpm tsc --noEmit
```

### Docker Issues
```bash
# Clean Docker system
docker system prune -a

# Rebuild without cache
docker build --no-cache -t kafbat/kafka-ui:local .

# Check running containers
docker ps

# View logs
docker logs <container-id>
```

## Release Process

### Version Management
```bash
# Version is in build.gradle
version = '1.5.0'

# Create git tag
git tag -a v1.5.0 -m "Release v1.5.0"
git push origin v1.5.0

# This triggers release workflows
```

### Build Artifacts
- **JAR**: `api/build/libs/api-{version}.jar`
- **Docker Image**: `ghcr.io/kafbat/kafka-ui:{version}`
- **Frontend Bundle**: `frontend/build/vite/` (embedded in JAR)

## Monitoring Build Times

### Gradle Build Scan
```bash
# Enable build scan
./gradlew build --scan

# Outputs URL to detailed build analysis
```

### Profile Frontend Build
```bash
cd frontend

# Analyze bundle size
pnpm build
pnpm vite-bundle-visualizer

# Check build time
time pnpm build
```

## Task Workflow
When assigned a build/DevOps task:
1. Read task: `backlog task <id> --plain`
2. Update status: `backlog task edit <id> -s "In Progress" -a @devops`
3. Create plan: `backlog task edit <id> --plan "..."`
4. Implement changes (Gradle, Docker, CI, etc.)
5. Test locally
6. Verify CI passes
7. Check AC: `backlog task edit <id> --check-ac <index>`
8. Add notes: `backlog task edit <id> --notes "..."`
9. Mark done: `backlog task edit <id> -s Done`
