import styled, { css } from 'styled-components';

export const EditorContainer = styled.div(
  ({ theme }) => css`
    border: 1px solid ${theme.layout.stuffBorderColor};
    border-radius: 8px;
    margin-bottom: 16px;
    padding: 16px;
    height: fit-content;

    & > h4 {
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      padding-bottom: 16px;
      margin: 0 0 16px 0;
      color: ${theme.heading.h4};
      border-bottom: 1px solid ${theme.layout.stuffBorderColor};
    }
  `
);

export const LLMPanelContainer = styled.div<{ $collapsed?: boolean }>(
  ({ theme, $collapsed }) => css`
    border: 1px solid ${theme.layout.stuffBorderColor};
    border-radius: 8px;
    margin-bottom: 16px;
    padding: 16px;
    background-color: ${theme.default.backgroundColor};
    transition: all 0.3s ease;

    ${$collapsed &&
    css`
      padding: 12px 16px;
    `}
  `
);

export const LLMPanelHeader = styled.div<{ $disabled?: boolean }>(
  ({ theme, $disabled }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: ${$disabled ? 'not-allowed' : 'pointer'};
    opacity: ${$disabled ? 0.5 : 1};
    padding-bottom: 16px;
    border-bottom: 1px solid ${theme.layout.stuffBorderColor};
    margin-bottom: 16px;

    & > h4 {
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: ${theme.heading.h4};
      margin: 0;
      padding: 0;
    }
  `
);

export const LLMPanelContent = styled.div<{ $collapsed?: boolean }>`
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')};
`;

export const ChatContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 16px;
    padding: 8px;
    background-color: ${theme.default.backgroundColor};
    border: 1px solid ${theme.layout.stuffBorderColor};
    border-radius: 4px;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${theme.layout.stuffBorderColor};
      border-radius: 4px;
    }
  `
);

export const ChatMessage = styled.div<{ $isUser?: boolean }>(
  ({ theme, $isUser }) => css`
    padding: 12px;
    border-radius: 8px;
    background-color: ${$isUser
      ? theme.select.backgroundColor.normal
      : theme.ksqlDb.query.editor.layer.backgroundColor};
    color: ${theme.default.color.normal};
    max-width: 85%;
    align-self: ${$isUser ? 'flex-end' : 'flex-start'};
    word-wrap: break-word;

    & > strong {
      display: block;
      margin-bottom: 4px;
      font-size: 12px;
      color: ${theme.default.color.normal};
      opacity: 0.7;
    }
  `
);

export const ChatInputWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

export const ArtifactContainer = styled.div(
  ({ theme }) => css`
    border: 1px solid ${theme.layout.stuffBorderColor};
    border-radius: 8px;
    padding: 16px;
    background-color: ${theme.default.backgroundColor};
    margin-bottom: 16px;

    & > h5 {
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: ${theme.heading.h4};
      margin-bottom: 12px;
    }
  `
);

export const ArtifactActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

export const LLMLayoutWrapper = styled.div`
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

export const ApiKeyBanner = styled.div(
  ({ theme }) => css`
    background-color: ${theme.default.backgroundColor};
    border: 1px solid ${theme.layout.stuffBorderColor};
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    & > p {
      margin: 0;
      color: ${theme.default.color.normal};
      font-size: 14px;
    }

    & > div {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  `
);
