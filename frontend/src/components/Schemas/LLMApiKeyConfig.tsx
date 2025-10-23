import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import Input from 'components/common/Input/Input';
import { Button } from 'components/common/Button/Button';
import { hasApiKey, setApiKey, clearApiKey } from 'lib/services/openrouter';

import * as S from './shared.styled';

interface LLMApiKeyConfigProps {
  onApiKeyConfigured: () => void;
}

const LLMApiKeyConfig: React.FC<LLMApiKeyConfigProps> = ({
  onApiKeyConfigured,
}) => {
  const [apiKey, setApiKeyState] = useState('');
  const [isConfigured, setIsConfigured] = useState(hasApiKey());

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      setApiKey(apiKey.trim());
      setIsConfigured(true);
      setApiKeyState('');
      onApiKeyConfigured();
    }
  };

  const handleClearApiKey = () => {
    clearApiKey();
    setIsConfigured(false);
    setApiKeyState('');
  };

  if (isConfigured) {
    return (
      <S.ApiKeyBanner>
        <p>
          <FontAwesomeIcon icon={faCheck} style={{ color: '#00c800' }} />{' '}
          OpenRouter API key configured
        </p>
        <div>
          <Button
            $buttonType="secondary"
            $buttonSize="S"
            onClick={handleClearApiKey}
          >
            <FontAwesomeIcon icon={faTimes} /> Clear API Key
          </Button>
        </div>
      </S.ApiKeyBanner>
    );
  }

  return (
    <S.ApiKeyBanner>
      <p>
        <FontAwesomeIcon icon={faKey} /> Configure your OpenRouter API key to
        use the Schema Assistant
      </p>
      <div>
        <Input
          inputSize="M"
          type="password"
          placeholder="OpenRouter API Key"
          value={apiKey}
          onChange={(e) => setApiKeyState(e.target.value)}
          style={{ flex: 1, minWidth: '300px' }}
        />
        <Button
          $buttonType="primary"
          $buttonSize="M"
          onClick={handleSaveApiKey}
          disabled={!apiKey.trim()}
        >
          <FontAwesomeIcon icon={faCheck} /> Save
        </Button>
      </div>
      <p style={{ fontSize: '12px', opacity: 0.7, margin: 0 }}>
        Get your API key from{' '}
        <a
          href="https://openrouter.ai/keys"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline' }}
        >
          openrouter.ai/keys
        </a>
      </p>
    </S.ApiKeyBanner>
  );
};

export default LLMApiKeyConfig;
