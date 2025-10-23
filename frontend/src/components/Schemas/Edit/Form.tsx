import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import {
  CompatibilityLevelCompatibilityEnum,
  SchemaSubject,
  SchemaType,
} from 'generated-sources';
import {
  clusterSchemaPath,
  clusterSchemasPath,
  ClusterSubjectParam,
} from 'lib/paths';
import yup from 'lib/yupExtended';
import { NewSchemaSubjectRaw } from 'lib/interfaces/schema';
import Editor from 'components/common/Editor/Editor';
import Select from 'components/common/Select/Select';
import { Button } from 'components/common/Button/Button';
import { InputLabel } from 'components/common/Input/InputLabel.styled';
import useAppParams from 'lib/hooks/useAppParams';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormError } from 'components/common/Input/Input.styled';
import { ErrorMessage } from '@hookform/error-message';
import {
  useCreateSchema,
  useUpdateSchemaCompatibilityLayer,
} from 'lib/hooks/api/schemas';
import ResourcePageHeading from 'components/common/ResourcePageHeading/ResourcePageHeading';
import { hasApiKey, DEFAULT_MODEL_ID } from 'lib/services/openrouter';
import LLMApiKeyConfig from 'components/Schemas/LLMApiKeyConfig';
import LLMModelSelector from 'components/Schemas/LLMModelSelector';
import LLMChatPanel from 'components/Schemas/LLMChatPanel';
import LLMSchemaArtifact from 'components/Schemas/LLMSchemaArtifact';

import * as S from './Edit.styled';

interface FormProps {
  schema: SchemaSubject;
}

const Form: React.FC<FormProps> = ({ schema }) => {
  const navigate = useNavigate();
  const { clusterName, subject } = useAppParams<ClusterSubjectParam>();
  const { mutateAsync: createSchema } = useCreateSchema(clusterName);
  const { mutateAsync: updateCompatibilityLayer } =
    useUpdateSchemaCompatibilityLayer({ clusterName, subject });

  // LLM integration state
  const [apiKeyConfigured, setApiKeyConfigured] = useState(hasApiKey());
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_ID);
  const [proposedSchema, setProposedSchema] = useState('');
  const isAvroSchema = schema?.schemaType === SchemaType.AVRO;
  const llmEnabled = isAvroSchema && apiKeyConfigured;

  const formatedSchema = React.useMemo(() => {
    return schema?.schemaType === SchemaType.PROTOBUF
      ? schema?.schema
      : JSON.stringify(JSON.parse(schema?.schema || '{}'), null, '\t');
  }, [schema]);

  const validationSchema = () =>
    yup.object().shape({
      newSchema:
        schema?.schemaType === SchemaType.PROTOBUF
          ? yup.string().required()
          : yup.string().required().isJsonObject('Schema syntax is not valid'),
    });
  const methods = useForm<NewSchemaSubjectRaw>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema()),
    defaultValues: {
      schemaType: schema?.schemaType,
      compatibilityLevel:
        schema?.compatibilityLevel as CompatibilityLevelCompatibilityEnum,
      newSchema: formatedSchema,
    },
  });

  const {
    formState: { isDirty, isSubmitting, dirtyFields, errors },
    control,
    handleSubmit,
    setValue,
  } = methods;

  const onSubmit = async (props: NewSchemaSubjectRaw) => {
    if (!schema) return;

    if (dirtyFields.compatibilityLevel) {
      await updateCompatibilityLayer({
        ...schema,
        compatibilityLevel: {
          compatibility: props.compatibilityLevel,
        },
      });
    }

    if (dirtyFields.newSchema || dirtyFields.schemaType) {
      await createSchema({
        ...schema,
        schema: props.newSchema || schema.schema,
        schemaType: props.schemaType || schema.schemaType,
      });
    }

    navigate(clusterSchemaPath(clusterName, subject));
  };

  const handleApiKeyConfigured = () => {
    setApiKeyConfigured(true);
  };

  const handleSchemaProposal = (newProposedSchema: string) => {
    setProposedSchema(newProposedSchema);
  };

  const handleCopyToEditor = (schemaToCopy: string) => {
    setValue('newSchema', schemaToCopy, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const schemaContext = {
    subject,
    schema: formatedSchema,
    schemaType: schema?.schemaType || '',
  };

  return (
    <FormProvider {...methods}>
      <ResourcePageHeading
        text={`${subject} Edit`}
        backText="Schema Registry"
        backTo={clusterSchemasPath(clusterName)}
      />
      <S.EditWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div>
              <InputLabel>Type</InputLabel>
              <Controller
                control={control}
                rules={{ required: true }}
                name="schemaType"
                render={({ field: { name, onChange, value } }) => (
                  <Select
                    name={name}
                    value={value}
                    onChange={onChange}
                    minWidth="100%"
                    disabled
                    options={Object.keys(SchemaType).map((type) => ({
                      value: type,
                      label: type,
                    }))}
                  />
                )}
              />
            </div>

            <div>
              <InputLabel>Compatibility level</InputLabel>
              <Controller
                control={control}
                name="compatibilityLevel"
                render={({ field: { name, onChange, value } }) => (
                  <Select
                    name={name}
                    value={value}
                    onChange={onChange}
                    minWidth="100%"
                    disabled={isSubmitting}
                    options={Object.keys(
                      CompatibilityLevelCompatibilityEnum
                    ).map((level) => ({ value: level, label: level }))}
                  />
                )}
              />
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
          </div>

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
            <S.EditorsWrapper>
              <div>
                <S.EditorContainer>
                  <h4>Latest schema</h4>
                  <Editor
                    schemaType={schema?.schemaType}
                    isFixedHeight
                    readOnly
                    height="372px"
                    value={formatedSchema}
                    name="latestSchema"
                    highlightActiveLine={false}
                  />
                </S.EditorContainer>
              </div>

              <div>
                <S.EditorContainer>
                  <h4>New schema</h4>
                  <Controller
                    control={control}
                    name="newSchema"
                    render={({ field: { name, onChange, value } }) => (
                      <Editor
                        schemaType={schema?.schemaType}
                        readOnly={isSubmitting}
                        defaultValue={value}
                        name={name}
                        onChange={onChange}
                      />
                    )}
                  />
                </S.EditorContainer>
                <FormError>
                  <ErrorMessage errors={errors} name="newSchema" />
                </FormError>
                <Button
                  $buttonType="primary"
                  $buttonSize="M"
                  type="submit"
                  disabled={!isDirty || isSubmitting || !!errors.newSchema}
                >
                  Submit
                </Button>
              </div>
            </S.EditorsWrapper>
          )}

          {isAvroSchema && (
            <S.LLMLayoutWrapper>
              <S.EditorContainer>
                <h4>Schema</h4>
                <Controller
                  control={control}
                  name="newSchema"
                  render={({ field: { name, onChange, value } }) => (
                    <Editor
                      schemaType={schema?.schemaType}
                      readOnly={isSubmitting}
                      defaultValue={value}
                      name={name}
                      onChange={onChange}
                    />
                  )}
                />
                <FormError>
                  <ErrorMessage errors={errors} name="newSchema" />
                </FormError>
                <Button
                  $buttonType="primary"
                  $buttonSize="M"
                  type="submit"
                  disabled={!isDirty || isSubmitting || !!errors.newSchema}
                  style={{ marginTop: '16px' }}
                >
                  Submit
                </Button>
              </S.EditorContainer>

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
            </S.LLMLayoutWrapper>
          )}
        </form>
      </S.EditWrapper>
    </FormProvider>
  );
};

export default Form;
