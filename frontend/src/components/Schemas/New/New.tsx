import React, { useState } from 'react';
import { NewSchemaSubjectRaw } from 'lib/interfaces/schema';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import {
  ClusterNameRoute,
  clusterSchemaPath,
  clusterSchemasPath,
} from 'lib/paths';
import { SchemaType } from 'generated-sources';
import { SCHEMA_NAME_VALIDATION_PATTERN } from 'lib/constants';
import { useNavigate } from 'react-router-dom';
import { InputLabel } from 'components/common/Input/InputLabel.styled';
import Input from 'components/common/Input/Input';
import { FormError } from 'components/common/Input/Input.styled';
import Select from 'components/common/Select/Select';
import { Button } from 'components/common/Button/Button';
import Editor from 'components/common/Editor/Editor';
import useAppParams from 'lib/hooks/useAppParams';
import yup from 'lib/yupExtended';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateSchema } from 'lib/hooks/api/schemas';
import ResourcePageHeading from 'components/common/ResourcePageHeading/ResourcePageHeading';
import { hasApiKey, DEFAULT_MODEL_ID } from 'lib/services/openrouter';
import LLMApiKeyConfig from 'components/Schemas/LLMApiKeyConfig';
import LLMModelSelector from 'components/Schemas/LLMModelSelector';
import LLMChatPanel from 'components/Schemas/LLMChatPanel';
import LLMSchemaArtifact from 'components/Schemas/LLMSchemaArtifact';
import * as SharedStyled from 'components/Schemas/shared.styled';

import * as S from './New.styled';

const SchemaTypeOptions = [
  { value: SchemaType.AVRO, label: 'AVRO' },
  { value: SchemaType.JSON, label: 'JSON' },
  { value: SchemaType.PROTOBUF, label: 'PROTOBUF' },
];

const validationSchema = yup.object().shape({
  subject: yup
    .string()
    .required('Subject is required.')
    .matches(
      SCHEMA_NAME_VALIDATION_PATTERN,
      'Only alphanumeric, _, -, and . allowed'
    ),
  schema: yup.string().required('Schema is required.'),
  schemaType: yup.string().required('Schema Type is required.'),
});

const New: React.FC = () => {
  const { clusterName } = useAppParams<ClusterNameRoute>();
  const navigate = useNavigate();
  const { mutateAsync } = useCreateSchema(clusterName);

  // LLM integration state
  const [apiKeyConfigured, setApiKeyConfigured] = useState(hasApiKey());
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_ID);
  const [proposedSchema, setProposedSchema] = useState('');

  const methods = useForm<NewSchemaSubjectRaw>({
    mode: 'onChange',
    defaultValues: {
      schemaType: SchemaType.AVRO,
    },
    resolver: yupResolver(validationSchema),
  });
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isDirty, isSubmitting, errors, isValid },
  } = methods;

  const selectedSchemaType = watch('schemaType');
  const isAvroSchema = selectedSchemaType === SchemaType.AVRO;
  const llmEnabled = isAvroSchema && apiKeyConfigured;

  const onSubmit = async ({
    subject,
    schema,
    schemaType,
  }: NewSchemaSubjectRaw) => {
    await mutateAsync({ subject, schema, schemaType });
    navigate(clusterSchemaPath(clusterName, subject));
  };

  const handleApiKeyConfigured = () => {
    setApiKeyConfigured(true);
  };

  const handleSchemaProposal = (newProposedSchema: string) => {
    setProposedSchema(newProposedSchema);
  };

  const handleCopyToEditor = (schemaToCopy: string) => {
    setValue('schema', schemaToCopy, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const schemaContext = {
    subject: watch('subject') || 'NewSchema',
    schema: watch('schema') || '',
    schemaType: selectedSchemaType || SchemaType.AVRO,
  };

  return (
    <FormProvider {...methods}>
      <ResourcePageHeading
        text="Create"
        backText="Schema Registry"
        backTo={clusterSchemasPath(clusterName)}
      />
      <S.FormWrapper>
        <S.Form onSubmit={handleSubmit(onSubmit)}>
          <S.FormFields>
            <div>
              <InputLabel>Subject *</InputLabel>
              <Input
                inputSize="M"
                placeholder="Schema Name"
                autoFocus
                name="subject"
                autoComplete="off"
                disabled={isSubmitting}
              />
              <FormError>
                <ErrorMessage errors={errors} name="subject" />
              </FormError>
            </div>

            <div>
              <InputLabel>Schema Type *</InputLabel>
              <Controller
                control={control}
                name="schemaType"
                defaultValue={SchemaTypeOptions[0].value}
                render={({ field: { name, onChange, value } }) => (
                  <Select
                    selectSize="M"
                    name={name}
                    value={value}
                    onChange={onChange}
                    minWidth="100%"
                    disabled={isSubmitting}
                    options={SchemaTypeOptions}
                  />
                )}
              />
              <FormError>
                <ErrorMessage errors={errors} name="schemaType" />
              </FormError>
            </div>

            {isAvroSchema && (
              <div>
                <LLMModelSelector
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  disabled={!apiKeyConfigured}
                />
              </div>
            )}
          </S.FormFields>

          {!isAvroSchema && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 165, 0, 0.1)',
                border: '1px solid rgba(255, 165, 0, 0.3)',
                borderRadius: '8px',
                fontSize: '14px',
                marginBottom: '16px',
              }}
            >
              LLM Schema Assistant is currently only available for AVRO schemas
            </div>
          )}

          {isAvroSchema && !apiKeyConfigured && (
            <LLMApiKeyConfig onApiKeyConfigured={handleApiKeyConfigured} />
          )}

          {!isAvroSchema && (
            <S.SchemaFieldsWrapper>
              <SharedStyled.EditorContainer>
                <h4>Schema</h4>
                <Controller
                  control={control}
                  name="schema"
                  render={({ field: { name, onChange, value } }) => (
                    <Editor
                      schemaType={selectedSchemaType}
                      readOnly={isSubmitting}
                      defaultValue={value}
                      name={name}
                      onChange={onChange}
                    />
                  )}
                />
                <FormError>
                  <ErrorMessage errors={errors} name="schema" />
                </FormError>
                <Button
                  $buttonSize="M"
                  $buttonType="primary"
                  type="submit"
                  disabled={!isValid || isSubmitting || !isDirty}
                  style={{ marginTop: '16px' }}
                >
                  Submit
                </Button>
              </SharedStyled.EditorContainer>
            </S.SchemaFieldsWrapper>
          )}

          {isAvroSchema && (
            <S.SchemaFieldsWrapper>
              <SharedStyled.EditorContainer>
                <h4>Schema</h4>
                <Controller
                  control={control}
                  name="schema"
                  render={({ field: { name, onChange, value } }) => (
                    <Editor
                      schemaType={selectedSchemaType}
                      readOnly={isSubmitting}
                      defaultValue={value}
                      name={name}
                      onChange={onChange}
                    />
                  )}
                />
                <FormError>
                  <ErrorMessage errors={errors} name="schema" />
                </FormError>
                <Button
                  $buttonSize="M"
                  $buttonType="primary"
                  type="submit"
                  disabled={!isValid || isSubmitting || !isDirty}
                  style={{ marginTop: '16px' }}
                >
                  Submit
                </Button>
              </SharedStyled.EditorContainer>

              <LLMSchemaArtifact
                proposedSchema={proposedSchema}
                onCopyToEditor={handleCopyToEditor}
                disabled={!llmEnabled}
              />

              <LLMChatPanel
                disabled={!llmEnabled}
                selectedModel={selectedModel}
                schemaContext={schemaContext}
                onSchemaProposal={handleSchemaProposal}
              />
            </S.SchemaFieldsWrapper>
          )}
        </S.Form>
      </S.FormWrapper>
    </FormProvider>
  );
};

export default New;
