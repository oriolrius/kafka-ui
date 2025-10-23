import styled from 'styled-components';

// Re-export shared styled components for backward compatibility
export {
  EditorContainer,
  LLMPanelContainer,
  LLMPanelHeader,
  LLMPanelContent,
  ChatContainer,
  ChatMessage,
  ChatInputWrapper,
  ArtifactContainer,
  ArtifactActions,
  LLMLayoutWrapper,
  ApiKeyBanner,
} from 'components/Schemas/shared.styled';

// Edit-specific styled components
export const EditWrapper = styled.div`
  padding: 16px;
  padding-top: 0;
  & > form {
    display: flex;
    flex-direction: column;
    gap: 16px;

    & > div:first-child {
      display: flex;
      gap: 16px;

      & > * {
        width: 20%;
      }
    }

    & > button:last-child {
      width: 72px;
      align-self: center;
    }
  }
`;

export const EditorsWrapper = styled.div`
  display: flex;
  gap: 16px;

  & > * {
    flex-grow: 1;
  }
`;
