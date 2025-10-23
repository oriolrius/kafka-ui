import {
  OpenRouterChatRequest,
  OpenRouterChatResponse,
  OpenRouterModelsResponse,
} from 'lib/interfaces/openrouter';

const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';

// Recommended models for Avro schema work (in priority order)
export const RECOMMENDED_MODELS: Array<{
  id: string;
  fallbackId?: string;
  note: string;
}> = [
  {
    id: 'anthropic/claude-sonnet-4.5-20250929',
    fallbackId: 'anthropic/claude-3.5-sonnet',
    note: 'Best overall',
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    note: 'Best overall',
  },
  {
    id: 'openai/gpt-4o',
    note: 'Fast, reliable',
  },
  {
    id: 'anthropic/claude-3.5-haiku',
    note: 'Budget friendly',
  },
  {
    id: 'openai/gpt-4o-mini',
    note: 'Most economical',
  },
  {
    id: 'qwen/qwen-2.5-coder-32b-instruct',
    note: 'Free, coding',
  },
  {
    id: 'deepseek/deepseek-coder',
    note: 'Free, structured',
  },
  {
    id: 'google/gemini-pro-1.5',
    note: 'Large context',
  },
  {
    id: 'meta-llama/llama-3.1-70b-instruct',
    note: 'Open source',
  },
  {
    id: 'mistralai/mistral-large',
    note: 'European, capable',
  },
];

export const DEFAULT_MODEL_ID: string = RECOMMENDED_MODELS[0].id;

// This should be stored in localStorage or environment config
// For now, we'll store it in localStorage
const getApiKey = (): string | null => {
  return localStorage.getItem('openrouter_api_key');
};

export const setApiKey = (apiKey: string): void => {
  localStorage.setItem('openrouter_api_key', apiKey);
};

export const hasApiKey = (): boolean => {
  return !!getApiKey();
};

export const clearApiKey = (): void => {
  localStorage.removeItem('openrouter_api_key');
};

const getHeaders = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('OpenRouter API key is not configured');
  }

  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.origin,
    'X-Title': 'Kafka UI Schema Assistant',
  };
};

export const fetchModels = async (): Promise<OpenRouterModelsResponse> => {
  const response = await fetch(`${OPENROUTER_API_BASE}/models`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.statusText}`);
  }

  return response.json();
};

export const sendChatMessage = async (
  request: OpenRouterChatRequest
): Promise<OpenRouterChatResponse> => {
  const response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send chat message: ${errorText}`);
  }

  return response.json();
};

export const validateAvroSchema = (
  schema: string
): {
  valid: boolean;
  error?: string;
} => {
  try {
    const parsed = JSON.parse(schema);

    // Basic AVRO schema validation
    if (typeof parsed !== 'object' || parsed === null) {
      return { valid: false, error: 'Schema must be a valid JSON object' };
    }

    // Check for required fields in AVRO schema
    if (!parsed.type) {
      return { valid: false, error: 'Schema must have a "type" field' };
    }

    // If it's a record type, check for name and fields
    if (parsed.type === 'record') {
      if (!parsed.name) {
        return {
          valid: false,
          error: 'Record schema must have a "name" field',
        };
      }
      if (!Array.isArray(parsed.fields)) {
        return {
          valid: false,
          error: 'Record schema must have a "fields" array',
        };
      }
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    };
  }
};
