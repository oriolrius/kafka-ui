import styled from 'styled-components';

export const FormWrapper = styled.div`
  padding: 16px;
  padding-top: 0;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormFields = styled.div`
  display: flex;
  gap: 16px;

  & > div {
    flex: 1;
    min-width: 200px;
  }

  & select {
    width: 100%;
  }
`;

export const SchemaFieldsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;

    & > div {
      grid-column: 1;
    }
  }

  @media (min-width: 1201px) and (max-width: 1500px) {
    grid-template-columns: 1fr 1fr;

    & > div:nth-child(3) {
      grid-column: 1 / -1;
    }
  }
`;

export const SchemaFieldColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  & textarea {
    height: 400px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro',
      monospace;
    font-size: 13px;
  }

  & > button {
    align-self: flex-start;
  }
`;

export const LLMColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
