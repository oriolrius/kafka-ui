# Schema Assistant Specialist Agent

## Role
Expert in Apache AVRO, Protobuf, JSON Schema, and the LLM-powered Schema Assistant feature in Kafbat UI.

## Expertise
- **AVRO**: Schema evolution, complex types, logical types
- **Protobuf**: Proto3 syntax, nested messages, field rules
- **JSON Schema**: Draft-04, validation, composition
- **Schema Registry**: Confluent Schema Registry API, compatibility modes
- **Schema Evolution**: Forward/backward compatibility patterns
- **LLM Integration**: OpenRouter API, schema generation prompts

## Schema Types

### AVRO Schema
```json
{
  "type": "record",
  "name": "UserEvent",
  "namespace": "com.example.events",
  "doc": "Represents a user action event",
  "fields": [
    {
      "name": "userId",
      "type": "string",
      "doc": "Unique user identifier"
    },
    {
      "name": "eventType",
      "type": {
        "type": "enum",
        "name": "EventType",
        "symbols": ["LOGIN", "LOGOUT", "PURCHASE"]
      }
    },
    {
      "name": "timestamp",
      "type": "long",
      "logicalType": "timestamp-millis"
    },
    {
      "name": "metadata",
      "type": ["null", {
        "type": "map",
        "values": "string"
      }],
      "default": null
    }
  ]
}
```

### Protobuf Schema
```protobuf
syntax = "proto3";

package com.example.events;

message UserEvent {
  string user_id = 1;
  EventType event_type = 2;
  int64 timestamp = 3;
  map<string, string> metadata = 4;

  enum EventType {
    LOGIN = 0;
    LOGOUT = 1;
    PURCHASE = 2;
  }
}
```

### JSON Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "UserEvent",
  "required": ["userId", "eventType", "timestamp"],
  "properties": {
    "userId": {
      "type": "string",
      "description": "Unique user identifier"
    },
    "eventType": {
      "type": "string",
      "enum": ["LOGIN", "LOGOUT", "PURCHASE"]
    },
    "timestamp": {
      "type": "integer",
      "format": "int64"
    },
    "metadata": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    }
  }
}
```

## Schema Evolution Patterns

### Backward Compatible (new code reads old data)
✅ Add field with default value
✅ Remove field
✅ Add enum value (AVRO only if default present)

❌ Remove required field
❌ Change field type
❌ Rename field (without alias)

### Forward Compatible (old code reads new data)
✅ Add required field
✅ Remove field with default

❌ Add required field without default
❌ Change field type

### Full Compatible (both directions)
✅ Add field with default value
✅ Remove field with default value

### Example: Adding Optional Field
```json
// Version 1
{
  "type": "record",
  "name": "User",
  "fields": [
    {"name": "id", "type": "string"},
    {"name": "name", "type": "string"}
  ]
}

// Version 2 (backward compatible)
{
  "type": "record",
  "name": "User",
  "fields": [
    {"name": "id", "type": "string"},
    {"name": "name", "type": "string"},
    {"name": "email", "type": ["null", "string"], "default": null}
  ]
}
```

## AVRO Complex Types

### Unions (Optional Fields)
```json
{
  "name": "optionalField",
  "type": ["null", "string"],
  "default": null
}
```

### Arrays
```json
{
  "name": "tags",
  "type": {
    "type": "array",
    "items": "string"
  }
}
```

### Maps
```json
{
  "name": "attributes",
  "type": {
    "type": "map",
    "values": "string"
  }
}
```

### Nested Records
```json
{
  "type": "record",
  "name": "Order",
  "fields": [
    {"name": "orderId", "type": "string"},
    {
      "name": "customer",
      "type": {
        "type": "record",
        "name": "Customer",
        "fields": [
          {"name": "customerId", "type": "string"},
          {"name": "name", "type": "string"}
        ]
      }
    }
  ]
}
```

### Logical Types
```json
{
  "name": "createdAt",
  "type": "long",
  "logicalType": "timestamp-millis"
}

{
  "name": "price",
  "type": "bytes",
  "logicalType": "decimal",
  "precision": 10,
  "scale": 2
}

{
  "name": "birthDate",
  "type": "int",
  "logicalType": "date"
}
```

## Schema Registry Integration

### Compatibility Modes
- **BACKWARD** (default): New schema can read old data
- **FORWARD**: Old schema can read new data
- **FULL**: Both backward and forward
- **NONE**: No compatibility checks

### Subject Naming Strategies
- **TopicNameStrategy**: `{topic}-key`, `{topic}-value`
- **RecordNameStrategy**: `{namespace}.{name}`
- **TopicRecordNameStrategy**: `{topic}-{namespace}.{name}`

### Schema Registry API
```bash
# List all subjects
curl http://localhost:8081/subjects

# Get latest schema version
curl http://localhost:8081/subjects/user-events-value/versions/latest

# Register new version
curl -X POST http://localhost:8081/subjects/user-events-value/versions \
  -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  -d '{"schema": "{\"type\":\"record\",\"name\":\"User\",...}"}'

# Check compatibility
curl -X POST http://localhost:8081/compatibility/subjects/user-events-value/versions/latest \
  -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  -d '{"schema": "{\"type\":\"record\",\"name\":\"User\",...}"}'

# Delete schema
curl -X DELETE http://localhost:8081/subjects/user-events-value
```

## LLM Schema Assistant

### Feature Overview
The LLM Schema Assistant is an AI-powered chat interface integrated into the Kafka UI Schema Registry editor that helps users:
- Create new schemas from descriptions
- Evolve existing schemas safely
- Add fields with proper types
- Ensure AVRO best practices
- Check compatibility

### Architecture
```
Frontend (React)
  └── SchemaEditor component
      └── LLM Chat Interface
          └── API call to backend

Backend (Spring Boot)
  └── SchemaAssistantController
      └── SchemaAssistantService
          └── OpenRouter API Client
              └── LLM (Claude, GPT-4, etc.)
```

### Configuration
```yaml
# application.yml
schema-assistant:
  enabled: true
  openrouter:
    api-key: ${OPENROUTER_API_KEY}
    default-model: anthropic/claude-3-5-sonnet
```

### Example Prompts

#### Creating a Schema
```
User: Create an AVRO schema for order events with order ID, customer info,
      items list, total amount, and timestamp.