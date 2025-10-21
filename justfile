# Justfile for Kafka UI Development
# Install just: https://github.com/casey/just

# Default recipe (shows available commands)
default:
    @just --list

# Run backend with custom UI configuration
backend port="51080":
    SERVER_PORT={{port}} UI_TITLE="Server Console" UI_USERMENU_ENABLED=true UI_USERMENU_ACCOUNTURL="https://iam.demo.m3.nexiona.io/realms/server/account" UI_USERMENU_LOGOUTURL="https://console.demo.m3.nexiona.io/oauth2/sign_out" UI_SOCIALLINKS_ENABLED=false UI_CUSTOMMENUITEMS_0_LABEL="Scheduler" UI_CUSTOMMENUITEMS_0_URL="https://wsl.ymbihq.local:3012" UI_CUSTOMMENUITEMS_0_ICON="⏰" DYNAMIC_CONFIG_ENABLED=true ./gradlew :api:bootRun

# Run backend with debug enabled
backend-debug port="51080":
    SERVER_PORT={{port}} UI_TITLE="Server Console" UI_USERMENU_ENABLED=true UI_USERMENU_ACCOUNTURL="https://iam.demo.m3.nexiona.io/realms/server/account" UI_USERMENU_LOGOUTURL="https://console.demo.m3.nexiona.io/oauth2/sign_out" UI_SOCIALLINKS_ENABLED=false UI_CUSTOMMENUITEMS_0_LABEL="Scheduler" UI_CUSTOMMENUITEMS_0_URL="https://wsl.ymbihq.local:3012" UI_CUSTOMMENUITEMS_0_ICON="⏰" DYNAMIC_CONFIG_ENABLED=true ./gradlew :api:bootRun --debug-jvm

# Setup frontend (first time only)
frontend-setup backend_port="51080":
    cd frontend && pnpm install
    cd frontend && pnpm gen:sources
    echo "VITE_DEV_PROXY=http://localhost:{{backend_port}}" > frontend/.env.local

# Run frontend dev server
frontend port="51081":
    @test -f frontend/.env.local || echo "VITE_DEV_PROXY=http://localhost:51080" > frontend/.env.local
    cd frontend && pnpm dev --port {{port}}

# Generate API sources for frontend
gen-sources:
    cd frontend && pnpm gen:sources

# Run both backend and frontend (info only)
dev:
    @echo "Run these commands in separate terminals:"
    @echo "  Terminal 1: just backend"
    @echo "  Terminal 2: just frontend"

# Clean build artifacts
clean:
    ./gradlew clean
    cd frontend && rm -rf node_modules/.vite

# Deep clean (removes node_modules)
clean-all:
    ./gradlew clean
    ./gradlew --stop
    cd frontend && rm -rf node_modules

# Install dependencies
install:
    cd frontend && pnpm install

# Build for production
build:
    ./gradlew clean build -x test -Pinclude-frontend=true

# Run with local Kafka (Docker)
kafka-up:
    docker-compose -f ./documentation/compose/kafbat-ui.yaml up -d kafka0 schemaregistry0

# Stop local Kafka
kafka-down:
    docker-compose -f ./documentation/compose/kafbat-ui.yaml down

# View Kafka logs
kafka-logs:
    docker-compose -f ./documentation/compose/kafbat-ui.yaml logs -f

# Run backend with local Kafka connection
backend-with-kafka port="51080":
    SERVER_PORT={{port}} UI_TITLE="Server Console" UI_USERMENU_ENABLED=true UI_USERMENU_ACCOUNTURL="https://iam.demo.m3.nexiona.io/realms/server/account" UI_USERMENU_LOGOUTURL="https://console.demo.m3.nexiona.io/oauth2/sign_out" UI_SOCIALLINKS_ENABLED=false UI_CUSTOMMENUITEMS_0_LABEL="Scheduler" UI_CUSTOMMENUITEMS_0_URL="https://wsl.ymbihq.local:3012" UI_CUSTOMMENUITEMS_0_ICON="⏰" KAFKA_CLUSTERS_0_NAME=local KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=localhost:9092 KAFKA_CLUSTERS_0_SCHEMAREGISTRY=http://localhost:8081 ./gradlew :api:bootRun

# Check application health
health port="51080":
    @curl -s http://localhost:{{port}}/actuator/health | jq '.'

# Check UI configuration
check-ui-config port="51080":
    @curl -s http://localhost:{{port}}/api/info | jq '.ui'

# Run tests
test:
    ./gradlew test

# Format frontend code
format:
    cd frontend && pnpm format

# Lint frontend code
lint:
    cd frontend && pnpm lint
