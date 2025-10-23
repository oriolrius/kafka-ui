# LLM Schema Assistant Integration

## Overview

This document describes the LLM-powered schema assistant integration for the Kafka UI schema registry editor. The integration provides an AI-powered chat interface to help users create and modify AVRO schemas using OpenRouter API.

## Features Implemented

### 1. OpenRouter API Integration
- **API Service**: [lib/services/openrouter.ts](frontend/src/lib/services/openrouter.ts)
- **Type Definitions**: [lib/interfaces/openrouter.ts](frontend/src/lib/interfaces/openrouter.ts)
- Supports fetching available LLM models
- Sends chat messages with schema context
- Includes AVRO schema validation

### 2. LLM Model Selector
- **Component**: [LLMModelSelector.tsx](frontend/src/components/Schemas/Edit/LLMModelSelector.tsx)
- Fetches and displays available OpenRouter models
- Allows users to select their preferred LLM model
- Shows loading states and error messages

### 3. Chat Interface
- **Component**: [LLMChatPanel.tsx](frontend/src/components/Schemas/Edit/LLMChatPanel.tsx)
- Collapsible panel for conversational interface
- Auto-scrolling chat history
- Keyboard shortcuts (Ctrl+Enter to send)
- Automatically extracts schema proposals from LLM responses
- System prompt includes current schema context

### 4. Schema Artifact/Canvas Panel
- **Component**: [LLMSchemaArtifact.tsx](frontend/src/components/Schemas/Edit/LLMSchemaArtifact.tsx)
- Displays LLM-proposed schemas in a read-only editor
- "Copy to Editor" button to transfer schema to the main editor
- "Validate AVRO" button to check schema compliance
- Visual feedback for validation results

### 5. API Key Configuration
- **Component**: [LLMApiKeyConfig.tsx](frontend/src/components/Schemas/Edit/LLMApiKeyConfig.tsx)
- Secure API key storage in localStorage
- Configuration banner with save/clear options
- Link to OpenRouter API key page

### 6. Updated Schema Editor Layout
- **Component**: [Form.tsx](frontend/src/components/Schemas/Edit/Form.tsx)
- Three-column layout (Latest Schema | New Schema | LLM Assistant)
- Responsive design that adapts to smaller screens
- Conditional rendering based on schema type (AVRO only)
- Integration with existing form validation

### 7. Styled Components
- **Styles**: [Edit.styled.ts](frontend/src/components/Schemas/Edit/Edit.styled.ts)
- `LLMPanelContainer`: Container for collapsible panels
- `LLMPanelHeader`: Clickable header with collapse icon
- `ChatContainer`: Scrollable chat message area
- `ChatMessage`: Individual message bubbles (user/assistant)
- `ArtifactContainer`: Schema proposal display area
- `LLMLayoutWrapper`: Responsive grid layout

## User Flow

### For AVRO Schemas:

1. **First Time Setup**
   - Navigate to schema edit page
   - See API key configuration banner
   - Enter OpenRouter API key from https://openrouter.ai/keys
   - API key is stored in localStorage

2. **Select LLM Model**
   - Choose from available OpenRouter models
   - Model list is fetched automatically

3. **Chat with Assistant**
   - Type questions or requests in the chat panel
   - Example: "Add a field for user email address"
   - System automatically includes current schema context
   - Press Ctrl+Enter to send message

4. **Review Proposed Schema**
   - LLM response appears in chat
   - Proposed schema extracted and displayed in artifact panel
   - Read-only JSON editor shows the proposed changes

5. **Validate Schema**
   - Click "Validate AVRO" button
   - See validation results (success/error)
   - Fix any issues with further chat

6. **Copy to Editor**
   - Click "Copy to Editor" button
   - Proposed schema is copied to "New Schema" editor
   - Make additional manual edits if needed
   - Submit the form to save

### For Non-AVRO Schemas (JSON, PROTOBUF):

- LLM Assistant is disabled
- Warning banner explains feature is only available for AVRO
- Standard two-column editor layout remains

## Technical Details

### API Integration

The OpenRouter service uses:
- **Endpoint**: `https://openrouter.ai/api/v1`
- **Authentication**: Bearer token from localStorage
- **Headers**: Includes referer and app title for attribution

### Schema Context

When chatting, the system prompt includes:
- Subject name
- Schema type (AVRO)
- Current schema JSON
- Instructions for best practices

Example system prompt:
```
You are an expert AVRO schema assistant. The user is working on the following schema:

Subject: user-events
Schema Type: AVRO
Current Schema:
```json
{
  "type": "record",
  "name": "UserEvent",
  "fields": [...]
}
```

When suggesting schema changes, provide the complete updated schema in a JSON code block.
Focus on AVRO best practices, proper field types, and schema evolution considerations.
```

### State Management

The Form component manages:
- `apiKeyConfigured`: Whether user has set up OpenRouter key
- `selectedModel`: Currently selected LLM model
- `proposedSchema`: Latest schema proposal from LLM
- `isAvroSchema`: Whether current schema type is AVRO
- `llmEnabled`: Combined flag (AVRO + API key configured)

### Schema Extraction

The chat panel automatically extracts schemas from LLM responses using regex:
```typescript
const schemaMatch =
  assistantMessage.content.match(/```json\s*([\s\S]*?)```/) ||
  assistantMessage.content.match(/```\s*([\s\S]*?)```/);
```

### AVRO Validation

Basic AVRO validation checks:
- Valid JSON structure
- Required "type" field
- For record types: "name" and "fields" required
- Fields must be an array

## Files Created

1. `frontend/src/lib/interfaces/openrouter.ts` - Type definitions
2. `frontend/src/lib/services/openrouter.ts` - API service
3. `frontend/src/components/Schemas/Edit/LLMModelSelector.tsx` - Model selector
4. `frontend/src/components/Schemas/Edit/LLMChatPanel.tsx` - Chat interface
5. `frontend/src/components/Schemas/Edit/LLMSchemaArtifact.tsx` - Schema artifact panel
6. `frontend/src/components/Schemas/Edit/LLMApiKeyConfig.tsx` - API key config

## Files Modified

1. `frontend/src/components/Schemas/Edit/Form.tsx` - Main integration
2. `frontend/src/components/Schemas/Edit/Edit.styled.ts` - Styled components

## Configuration

### Environment Variables (Optional)

The API key is stored in localStorage, but you could extend this to support:
- `OPENROUTER_API_KEY`: Pre-configured API key
- `OPENROUTER_DEFAULT_MODEL`: Default model selection

### OpenRouter API Key

Get your API key from: https://openrouter.ai/keys

The service supports any model available in OpenRouter's catalog, including:
- OpenAI GPT models
- Anthropic Claude models
- Google Gemini models
- Meta Llama models
- And many more

## Future Enhancements

Potential improvements for future iterations:

1. **Support for Other Schema Types**
   - Enable for JSON schemas
   - Enable for Protobuf schemas

2. **Advanced Validation**
   - Schema compatibility checking
   - Schema evolution validation
   - Integration with Schema Registry validation

3. **Enhanced UX**
   - Diff view between current and proposed schema
   - Schema suggestion preview before applying
   - Multi-schema conversations with history

4. **Model Configuration**
   - Temperature and token controls
   - Model-specific settings
   - Cost estimation display

5. **Prompt Templates**
   - Pre-built prompts for common tasks
   - Custom prompt templates
   - Prompt history and favorites

6. **Backend Integration**
   - Store API keys securely on server
   - Proxy OpenRouter requests through backend
   - Rate limiting and usage tracking

## Security Considerations

- API keys stored in localStorage (client-side)
- Consider moving to secure backend storage for production
- Validate all LLM-generated schemas before applying
- Sanitize schema content to prevent injection attacks
- Rate limit API requests to prevent abuse

## Testing

See the comprehensive testing guide: [TESTING_LLM_ASSISTANT.md](TESTING_LLM_ASSISTANT.md)

### Quick Test Setup

```bash
# Terminal 1: Start test environment (Kafka + Schema Registry)
just test-schema-registry-up
just test-schema-registry-create-sample

# Terminal 2: Start backend
just test-backend

# Terminal 3: Start frontend
just frontend

# Browser: http://localhost:51081
# Navigate to: Clusters → test-local → Schema Registry
```

For detailed testing instructions, troubleshooting, and examples, see [TESTING_LLM_ASSISTANT.md](TESTING_LLM_ASSISTANT.md)

## Dependencies

No new dependencies were added. The implementation uses:
- Existing FontAwesome icons
- React hooks (useState, useEffect, useRef)
- Existing styled-components setup
- Existing form components (Select, Input, Textarea, Button)
- Existing Editor component

## Troubleshooting

### API Key Issues
- Verify key is valid at https://openrouter.ai/keys
- Check browser console for API errors
- Clear localStorage and re-enter key

### Model Loading Issues
- Check network connectivity
- Verify API key has proper permissions
- Check OpenRouter service status

### Schema Validation Issues
- Ensure schema is valid JSON
- Check AVRO schema requirements
- Validate against Schema Registry if needed

### Chat Not Working
- Ensure model is selected
- Check API key is configured
- Verify schema context is loaded
- Check browser console for errors