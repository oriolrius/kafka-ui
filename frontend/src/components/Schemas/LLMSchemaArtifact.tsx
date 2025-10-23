import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy,
  faCheck,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from 'components/common/Button/Button';
import Editor from 'components/common/Editor/Editor';
import { SchemaType } from 'generated-sources';
import { validateAvroSchema } from 'lib/services/openrouter';

import * as S from './shared.styled';

interface LLMSchemaArtifactProps {
  proposedSchema: string;
  onCopyToEditor: (schema: string) => void;
  disabled?: boolean;
}

const LLMSchemaArtifact: React.FC<LLMSchemaArtifactProps> = ({
  proposedSchema,
  onCopyToEditor,
  disabled = false,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [validationResult, setValidationResult] = React.useState<{
    valid: boolean;
    error?: string;
  } | null>(null);

  const handleCopy = () => {
    onCopyToEditor(proposedSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleValidate = () => {
    const result = validateAvroSchema(proposedSchema);
    setValidationResult(result);
    setTimeout(() => setValidationResult(null), 5000);
  };

  React.useEffect(() => {
    setValidationResult(null);
    setCopied(false);
  }, [proposedSchema]);

  return (
    <S.EditorContainer>
      <h4>Proposed Schema</h4>

      {proposedSchema ? (
        <>
          <Editor
            schemaType={SchemaType.AVRO}
            isFixedHeight
            readOnly
            height="372px"
            value={proposedSchema}
            name="proposedSchema"
            highlightActiveLine={false}
          />

          <S.ArtifactActions>
            <Button
              $buttonType="primary"
              $buttonSize="M"
              onClick={handleCopy}
              disabled={disabled || !proposedSchema}
            >
              <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
              {copied ? ' Copied!' : ' Copy to Editor'}
            </Button>

            <Button
              $buttonType="secondary"
              $buttonSize="M"
              onClick={handleValidate}
              disabled={disabled || !proposedSchema}
            >
              <FontAwesomeIcon
                icon={(() => {
                  if (validationResult?.valid === true) return faCheck;
                  if (validationResult?.valid === false)
                    return faExclamationTriangle;
                  return faCheck;
                })()}
              />
              {' Validate AVRO'}
            </Button>
          </S.ArtifactActions>

          {validationResult && (
            <div
              style={{
                marginTop: '12px',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: validationResult.valid
                  ? 'rgba(0, 200, 0, 0.1)'
                  : 'rgba(255, 0, 0, 0.1)',
                color: validationResult.valid ? '#00c800' : '#ff0000',
                border: `1px solid ${validationResult.valid ? '#00c800' : '#ff0000'}`,
              }}
            >
              {validationResult.valid ? (
                <>
                  <FontAwesomeIcon icon={faCheck} /> Valid AVRO schema
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faExclamationTriangle} />{' '}
                  {validationResult.error}
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <div
          style={{
            textAlign: 'center',
            opacity: 0.6,
            padding: '40px 20px',
            fontSize: '14px',
            border: '1px dashed rgba(128, 128, 128, 0.3)',
            borderRadius: '8px',
            minHeight: '372px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Schema proposals from the AI assistant will appear here
        </div>
      )}
    </S.EditorContainer>
  );
};

export default LLMSchemaArtifact;
