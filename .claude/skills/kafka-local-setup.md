# Kafka Local Setup Skill

Start a local Kafka cluster with Schema Registry for development/testing.

## What it does:
1. Starts Kafka broker (Docker)
2. Starts Schema Registry (Docker)
3. Verifies services are healthy
4. Optionally creates sample schemas

## Usage:
Use when you need a local Kafka for development or testing.

## Two Options:

### Option 1: Documentation Compose (Full Stack)
```bash
# Start Kafka + Schema Registry
just kafka-up

# This starts:
# - Kafka broker on localhost:9092
# - Schema Registry on http://localhost:8081

# View logs
just kafka-logs

# Stop
just kafka-down
```

### Option 2: Test Schema Registry (Lightweight)
```bash
# Start test environment
just test-schema-registry-up

# This starts:
# - Kafka 4.1.0 on localhost:9092
# - Schema Registry 8.1.0 on http://localhost:8085
# - No authentication/SSL

# Create sample schema
just test-schema-registry-create-sample

# List schemas
just test-schema-registry-list

# Stop and clean
just test-schema-registry-down
```

## Verification:

### Check Kafka
```bash
# Using docker
docker ps | grep kafka

# Using kcat (if installed)
kcat -b localhost:9092 -L
```

### Check Schema Registry
```bash
# Health check
curl http://localhost:8081/

# Or for test environment
curl http://localhost:8085/

# List subjects
curl http://localhost:8081/subjects
```

## Connect Backend to Local Kafka:
```bash
# Run backend with local Kafka connection
just backend-with-kafka

# Or manually with env vars
KAFKA_CLUSTERS_0_NAME=local \
KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=localhost:9092 \
KAFKA_CLUSTERS_0_SCHEMAREGISTRY=http://localhost:8081 \
./gradlew :api:bootRun
```

## Create Test Topic:
```bash
# Using kafka-topics.sh (from Kafka container)
docker exec -it kafka0 kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --create \
  --topic test-topic \
  --partitions 3 \
  --replication-factor 1

# Or use the UI after connecting
```

## Clean Up:
```bash
# Stop and remove volumes
just kafka-down

# Or for test environment
just test-schema-registry-down
```

## Ports Used:
- **9092**: Kafka broker
- **8081**: Schema Registry (main)
- **8085**: Schema Registry (test)
- **2181**: ZooKeeper (if used)
