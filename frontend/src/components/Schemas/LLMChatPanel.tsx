import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from 'components/common/Button/Button';
import { Textarea } from 'components/common/Textbox/Textarea.styled';
import { ChatMessage as ChatMessageType } from 'lib/interfaces/openrouter';
import { sendChatMessage } from 'lib/services/openrouter';

import * as S from './shared.styled';

interface LLMChatPanelProps {
  disabled?: boolean;
  selectedModel: string;
  schemaContext: {
    subject: string;
    schema: string;
    schemaType: string;
  };
  onSchemaProposal: (schema: string) => void;
}

const LLMChatPanel: React.FC<LLMChatPanelProps> = ({
  disabled = false,
  selectedModel,
  schemaContext,
  onSchemaProposal,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState<
    Array<ChatMessageType & { id: string; timestamp: number }>
  >([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || !selectedModel || isLoading) return;

    const userMessage: ChatMessageType & { id: string; timestamp: number } = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const systemPrompt = `You are an expert AVRO schema assistant. The user is working on the following schema:

Subject: ${schemaContext.subject}
Schema Type: ${schemaContext.schemaType}
Current Schema:
\`\`\`json
${schemaContext.schema}
\`\`\`

When suggesting schema changes, provide the complete updated schema in a JSON code block.
Focus on AVRO best practices, proper field types, and schema evolution considerations.`;

      const response = await sendChatMessage({
        model: selectedModel,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          { role: 'user', content: userInput },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const assistantMessage: ChatMessageType & {
        id: string;
        timestamp: number;
      } = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.choices[0].message.content,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Extract JSON schema from code blocks
      const schemaMatch =
        assistantMessage.content.match(/```json\s*([\s\S]*?)```/) ||
        assistantMessage.content.match(/```\s*([\s\S]*?)```/);

      if (schemaMatch && schemaMatch[1]) {
        onSchemaProposal(schemaMatch[1].trim());
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessageType & { id: string; timestamp: number } =
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
          timestamp: Date.now(),
        };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <S.EditorContainer>
      <S.LLMPanelHeader
        $disabled={disabled}
        onClick={() => !disabled && setCollapsed(!collapsed)}
      >
        <h4>Chat Assistant</h4>
        <FontAwesomeIcon icon={collapsed ? faChevronDown : faChevronUp} />
      </S.LLMPanelHeader>

      <S.LLMPanelContent $collapsed={collapsed}>
        <S.ChatContainer ref={chatContainerRef}>
          {messages.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                opacity: 0.6,
                padding: '20px',
                fontSize: '14px',
              }}
            >
              Start a conversation to get help with your AVRO schema
            </div>
          )}
          {messages.map((message) => (
            <S.ChatMessage key={message.id} $isUser={message.role === 'user'}>
              <strong>{message.role === 'user' ? 'You' : 'Assistant'}</strong>
              <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
            </S.ChatMessage>
          ))}
          {isLoading && (
            <S.ChatMessage>
              <strong>Assistant</strong>
              <div>Thinking...</div>
            </S.ChatMessage>
          )}
        </S.ChatContainer>

        <S.ChatInputWrapper>
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about the schema... (Ctrl+Enter to send)"
            disabled={isLoading || !selectedModel}
            rows={3}
            style={{ flex: 1 }}
          />
          <Button
            $buttonType="primary"
            $buttonSize="M"
            onClick={handleSendMessage}
            disabled={
              !userInput.trim() || !selectedModel || isLoading || disabled
            }
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </S.ChatInputWrapper>
      </S.LLMPanelContent>
    </S.EditorContainer>
  );
};

export default LLMChatPanel;
