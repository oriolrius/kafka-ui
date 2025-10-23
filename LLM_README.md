# LLM Schema Assistant for Kafka UI

An AI-powered schema editing assistant integrated into the Kafka UI Schema Registry editor.

## 📚 Documentation

- **[LLM_SCHEMA_ASSISTANT.md](LLM_SCHEMA_ASSISTANT.md)** - Complete technical documentation
  - Architecture overview
  - Component descriptions
  - API integration details
  - User flow walkthrough
  - Security considerations

- **[TESTING_LLM_ASSISTANT.md](TESTING_LLM_ASSISTANT.md)** - Testing guide
  - Quick start instructions
  - Test environment setup
  - Example prompts and workflows
  - Troubleshooting guide

## 🚀 Quick Start

### 1. Start Test Environment

```bash
# Start Kafka 4.1.0 + Schema Registry 8.1.0 (no auth)
just test-schema-registry-up

# Create a sample AVRO schema
just test-schema-registry-create-sample
```

### 2. Start Application

```bash
# Terminal 1: Backend
just test-backend

# Terminal 2: Frontend
just frontend
```

### 3. Configure & Test

1. Open http://localhost:51081
2. Navigate to: **Clusters → test-local → Schema Registry**
3. Edit the `user-events-value` schema
4. Configure your OpenRouter API key (get one at https://openrouter.ai/keys)
5. Select an LLM model
6. Start chatting with the assistant!

## ✨ Key Features

- **Chat Interface**: Conversational schema editing with context awareness
- **Schema Artifact**: Canvas-style display of LLM proposals (like ChatGPT/Claude)
- **One-Click Copy**: Transfer proposals directly to the editor
- **AVRO Validation**: Client-side validation with visual feedback
- **Model Selection**: Choose from 100+ models via OpenRouter
- **Collapsible Panels**: Clean, space-efficient interface
- **Conditional UI**: Only enabled for AVRO schemas

## 📋 Available Commands

### Test Environment

```bash
just test-schema-registry-up              # Start Kafka + Schema Registry
just test-schema-registry-down            # Stop and cleanup
just test-schema-registry-status          # Check service health
just test-schema-registry-logs            # View logs
just test-schema-registry-create-sample   # Create sample schema
just test-schema-registry-list            # List all schemas
just test-schema-registry-get SUBJECT     # Get schema details
```

### Application

```bash
just test-backend      # Start backend with test cluster
just frontend          # Start frontend dev server
just test-full-setup   # Show complete setup instructions
```

## 🎯 Example Prompts

Try these prompts in the chat:

**Add a field:**
```
Add a field called "email" of type string
```

**Modify field type:**
```
Change the timestamp field to use logical type "timestamp-millis"
```

**Schema evolution:**
```
Add an optional field for user preferences. Make sure it's backward compatible
```

**Documentation:**
```
Add proper documentation to all fields
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Schema Edit Page (Form.tsx)                            │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐  │
│  │   Latest    │  │     New     │  │  LLM Assistant │  │
│  │   Schema    │  │   Schema    │  │                │  │
│  │ (read-only) │  │  (editable) │  │  ┌──────────┐  │  │
│  │             │  │             │  │  │ Artifact │  │  │
│  │             │  │             │  │  │  Panel   │  │  │
│  │             │  │             │  │  └──────────┘  │  │
│  │             │  │             │  │  ┌──────────┐  │  │
│  │             │  │             │  │  │   Chat   │  │  │
│  │             │  │             │  │  │  Panel   │  │  │
│  └─────────────┘  └─────────────┘  │  └──────────┘  │  │
│                                     └────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 🔐 Security

- API keys stored in browser localStorage (client-side)
- All LLM-generated schemas should be validated before submission
- For production, consider proxying OpenRouter requests through backend
- No new dependencies added - uses existing libraries

## 🛠️ Development

### TypeScript & Linting

```bash
# Check TypeScript types
pnpm tsc --noEmit

# Lint code
pnpm lint

# Format code
pnpm format
```

### Components

- `LLMApiKeyConfig.tsx` - API key management
- `LLMModelSelector.tsx` - Model dropdown
- `LLMChatPanel.tsx` - Chat interface
- `LLMSchemaArtifact.tsx` - Schema artifact/canvas
- `Form.tsx` - Main integration

### Services

- `lib/services/openrouter.ts` - OpenRouter API integration
- `lib/interfaces/openrouter.ts` - TypeScript types

## 📖 More Information

- Full documentation: [LLM_SCHEMA_ASSISTANT.md](LLM_SCHEMA_ASSISTANT.md)
- Testing guide: [TESTING_LLM_ASSISTANT.md](TESTING_LLM_ASSISTANT.md)
- OpenRouter API: https://openrouter.ai/docs
- Get API key: https://openrouter.ai/keys

## 🎓 Tips

1. **Use descriptive prompts**: Be specific about what you want
2. **Iterate in chat**: Ask follow-up questions to refine the schema
3. **Validate before copying**: Always validate the proposed schema
4. **Review manually**: Check the schema before submitting
5. **Test different models**: Some models are better at structured output

## 🐛 Troubleshooting

See the detailed troubleshooting section in [TESTING_LLM_ASSISTANT.md](TESTING_LLM_ASSISTANT.md)

Common issues:
- **Models not loading**: Check API key and network
- **Chat not working**: Ensure model is selected
- **Schema not extracted**: LLM response must use JSON code blocks
- **API key lost**: Clear localStorage and re-enter

## 🚧 Current Limitations

- Only AVRO schemas supported (JSON/Protobuf coming later)
- Client-side API key storage (consider backend proxy for production)
- Basic AVRO validation (extend for schema compatibility checks)
- English prompts only (multilingual support possible)

## 🔮 Future Enhancements

- Support for JSON and Protobuf schemas
- Schema compatibility validation
- Diff view for proposed changes
- Prompt templates for common tasks
- Backend API key storage
- Usage tracking and cost estimation
- Multi-schema conversations with history

## 📄 License

Same as Kafka UI project