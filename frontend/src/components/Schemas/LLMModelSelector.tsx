import React, { useEffect, useState } from 'react';
import Select from 'components/common/Select/Select';
import { OpenRouterModel } from 'lib/interfaces/openrouter';
import { fetchModels, RECOMMENDED_MODELS } from 'lib/services/openrouter';
import { InputLabel } from 'components/common/Input/InputLabel.styled';

interface LLMModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  disabled?: boolean;
}

const LLMModelSelector: React.FC<LLMModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  disabled = false,
}) => {
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchModels();
        setModels(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load models');
        // eslint-disable-next-line no-console
        console.error('Failed to fetch OpenRouter models:', err);
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  // Auto-select first available recommended model if selected model is not available
  useEffect(() => {
    if (models.length === 0) return;

    const modelsById = new Map(models.map((m) => [m.id, m]));
    const selectedModelExists = modelsById.has(selectedModel);

    // If selected model doesn't exist, try to find first available recommended model
    if (!selectedModelExists) {
      const firstAvailable = RECOMMENDED_MODELS.find((rec) =>
        modelsById.has(rec.id)
      );
      if (firstAvailable) {
        onModelChange(firstAvailable.id);
      }
    }
  }, [models, selectedModel, onModelChange]);

  // Create a map of available models by ID
  const modelsById = new Map(models.map((m) => [m.id, m]));

  // Get recommended models that are available
  const recommendedOptions = RECOMMENDED_MODELS.map((rec) => {
    const model = modelsById.get(rec.id);
    if (!model) return null;

    const modelName = model.name || model.id;
    return {
      value: model.id,
      label: `${modelName} — ${rec.note}`,
    };
  }).filter((opt): opt is { value: string; label: string } => opt !== null);

  // Get remaining models (not in recommended list)
  const recommendedIds = new Set(RECOMMENDED_MODELS.map((r) => r.id));
  const otherOptions = models
    .filter((model) => !recommendedIds.has(model.id))
    .map((model) => ({
      value: model.id,
      label: model.name || model.id,
    }));

  // Combine: recommended first, then separator, then others
  const modelOptions = [
    ...recommendedOptions,
    ...(otherOptions.length > 0
      ? [{ value: '---', label: '────────────────', disabled: true }]
      : []),
    ...otherOptions,
  ];

  return (
    <div>
      <InputLabel>LLM Model</InputLabel>
      <Select
        selectSize="M"
        name="llmModel"
        value={selectedModel}
        onChange={onModelChange}
        minWidth="100%"
        disabled={disabled || loading}
        options={modelOptions}
        placeholder={loading ? 'Loading models...' : 'Select a model'}
      />
      {error && (
        <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default LLMModelSelector;
