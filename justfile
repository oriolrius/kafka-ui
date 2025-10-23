# Justfile for Kafka UI Development
# Install just: https://github.com/casey/just

# Default recipe (shows available commands)
default:
    @just --list

# Run backend with custom UI configuration
backend port="51080":
    SERVER_PORT={{port}} UI_TITLE="Server Console" UI_USERMENU_ENABLED=true UI_USERMENU_ACCOUNTURL="https://iam.demo.m3.nexiona.io/realms/server/account" UI_USERMENU_LOGOUTURL="https://console.demo.m3.nexiona.io/oauth2/sign_out" UI_SOCIALLINKS_ENABLED=false UI_CUSTOMMENUITEMS_0_LABEL="Scheduler" UI_CUSTOMMENUITEMS_0_URL="https://wsl.ymbihq.local:3012" UI_CUSTOMMENUITEMS_0_ICON="fa-clock" DYNAMIC_CONFIG_ENABLED=true ./gradlew :api:bootRun

# Run backend with debug enabled
backend-debug port="51080":
    SERVER_PORT={{port}} UI_TITLE="Server Console" UI_USERMENU_ENABLED=true UI_USERMENU_ACCOUNTURL="https://iam.demo.m3.nexiona.io/realms/server/account" UI_USERMENU_LOGOUTURL="https://console.demo.m3.nexiona.io/oauth2/sign_out" UI_SOCIALLINKS_ENABLED=false UI_CUSTOMMENUITEMS_0_LABEL="Scheduler" UI_CUSTOMMENUITEMS_0_URL="https://wsl.ymbihq.local:3012" UI_CUSTOMMENUITEMS_0_ICON="fa-clock" DYNAMIC_CONFIG_ENABLED=true ./gradlew :api:bootRun --debug-jvm

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
    SERVER_PORT={{port}} UI_TITLE="Server Console" UI_USERMENU_ENABLED=true UI_USERMENU_ACCOUNTURL="https://iam.demo.m3.nexiona.io/realms/server/account" UI_USERMENU_LOGOUTURL="https://console.demo.m3.nexiona.io/oauth2/sign_out" UI_SOCIALLINKS_ENABLED=false UI_CUSTOMMENUITEMS_0_LABEL="Scheduler" UI_CUSTOMMENUITEMS_0_URL="https://wsl.ymbihq.local:3012" UI_CUSTOMMENUITEMS_0_ICON="fa-clock" KAFKA_CLUSTERS_0_NAME=local KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=localhost:9092 KAFKA_CLUSTERS_0_SCHEMAREGISTRY=http://localhost:8081 ./gradlew :api:bootRun

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

# ============================================================================
# Test Schema Registry Environment (for LLM Schema Assistant testing)
# ============================================================================

# Start test Kafka + Schema Registry (no SSL/auth)
test-schema-registry-up:
    docker compose -f docker-compose.test-schema-registry.yml up -d
    @echo "Waiting for services to be ready..."
    @sleep 10
    @echo "\n✅ Test environment ready!"
    @echo "  Kafka:           localhost:9092"
    @echo "  Schema Registry: http://localhost:8085"
    @echo "\nRun 'just test-schema-registry-status' to check health"

# Stop test Schema Registry environment
test-schema-registry-down:
    docker compose -f docker-compose.test-schema-registry.yml down -v
    @echo "✅ Test environment stopped and volumes removed"

# Check status of test environment
test-schema-registry-status:
    @echo "=== Service Health ==="
    @docker compose -f docker-compose.test-schema-registry.yml ps
    @echo "\n=== Schema Registry Health ==="
    @curl -s http://localhost:8085/ | jq '.' || echo "❌ Schema Registry not responding"

# View logs from test environment
test-schema-registry-logs service="":
    #!/usr/bin/env bash
    if [ -z "{{service}}" ]; then
        docker compose -f docker-compose.test-schema-registry.yml logs -f
    else
        docker compose -f docker-compose.test-schema-registry.yml logs -f {{service}}
    fi

# Create sample AVRO schema for testing
test-schema-registry-create-sample:
    #!/usr/bin/env bash
    echo "Creating sample AVRO schema..."
    curl -X POST http://localhost:8085/subjects/user-events-value/versions \
      -H "Content-Type: application/vnd.schemaregistry.v1+json" \
      -d '{
        "schema": "{\"type\":\"record\",\"name\":\"UserEvent\",\"namespace\":\"com.example\",\"fields\":[{\"name\":\"userId\",\"type\":\"string\"},{\"name\":\"eventType\",\"type\":\"string\"},{\"name\":\"timestamp\",\"type\":\"long\"}]}"
      }' | jq '.'
    echo "\n✅ Sample schema created: user-events-value"

# List all schemas
test-schema-registry-list:
    @echo "=== Registered Schemas ==="
    @curl -s http://localhost:8085/subjects | jq '.'

# Get schema details
test-schema-registry-get subject="user-events-value":
    @echo "=== Schema: {{subject}} ==="
    @curl -s http://localhost:8085/subjects/{{subject}}/versions/latest | jq -r '.schema' | jq '.'

# Delete a schema (useful for testing)
test-schema-registry-delete subject="user-events-value":
    @echo "Deleting schema: {{subject}}"
    @curl -X DELETE http://localhost:8085/subjects/{{subject}} | jq '.'
    @echo "✅ Schema {{subject}} deleted"

# Run backend with test Schema Registry
test-backend port="51080":
    SERVER_PORT={{port}} \
    UI_TITLE="Kafka Console (Test)" \
    KAFKA_CLUSTERS_0_NAME=test-local \
    KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=localhost:9092 \
    KAFKA_CLUSTERS_0_SCHEMAREGISTRY=http://localhost:8085 \
    ./gradlew :api:bootRun

# Complete test setup: start services + backend + frontend (info only)
test-full-setup:
    @echo "🚀 Complete Test Setup for LLM Schema Assistant"
    @echo ""
    @echo "Run these commands in separate terminals:"
    @echo ""
    @echo "  Terminal 1: just test-schema-registry-up"
    @echo "  Terminal 2: just test-backend"
    @echo "  Terminal 3: just frontend"
    @echo ""
    @echo "After services are up:"
    @echo "  - Create sample schema: just test-schema-registry-create-sample"
    @echo "  - Open: http://localhost:51081"
    @echo "  - Navigate to: Clusters -> test-local -> Schema Registry"
    @echo "  - Edit a schema to test LLM assistant"
    @echo ""
    @echo "Configure OpenRouter API key in the UI to enable LLM features"
