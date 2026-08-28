import { useCallback, useRef, useState } from 'react';
import { extractNavSuggestions, type NavSuggestion } from '../../lib/assistant/nav-parser';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  navSuggestions?: NavSuggestion[];
  isStreaming?: boolean;
}

const createId = () => Math.random().toString(36).slice(2);

// Đọc phản hồi dạng SSE (Server-Sent Events, định dạng chuẩn của API
// OpenAI-compatible khi bật stream: true) và gọi onDelta mỗi khi có thêm chữ.
async function readAssistantStream(response: Response, onDelta: (content: string) => void): Promise<string> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let content = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine.startsWith('data:')) continue;
      const payload = trimmedLine.slice(5).trim();
      if (!payload || payload === '[DONE]') continue;
      try {
        const parsed = JSON.parse(payload);
        const delta: unknown = parsed?.choices?.[0]?.delta?.content;
        if (typeof delta === 'string' && delta.length > 0) {
          content += delta;
          onDelta(content);
        }
      } catch {
        // Bỏ qua dòng không phải JSON hợp lệ.
      }
    }
  }

  return content;
}

export function useAssistantChat(pathname: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const sendMessage = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || isSending) return;

      const userMessage: ChatMessage = { id: createId(), role: 'user', content: trimmed };
      const assistantId = createId();
      const historyForRequest = [...messages, userMessage];

      setMessages([...historyForRequest, { id: assistantId, role: 'assistant', content: '', isStreaming: true }]);
      setIsSending(true);

      const updateAssistant = (updater: (message: ChatMessage) => ChatMessage) => {
        setMessages((current) => current.map((message) => (message.id === assistantId ? updater(message) : message)));
      };

      try {
        const response = await fetch('/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: historyForRequest.map(({ role, content }) => ({ role, content })),
            pathname: pathnameRef.current,
          }),
        });

        if (!response.ok || !response.body) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error ?? 'Trợ lý đang gặp sự cố, vui lòng thử lại sau.');
        }

        const fullContent = await readAssistantStream(response, (snapshot) => {
          updateAssistant((message) => ({ ...message, content: snapshot }));
        });

        const { text, suggestions } = extractNavSuggestions(fullContent);
        updateAssistant((message) => ({ ...message, content: text, navSuggestions: suggestions, isStreaming: false }));
      } catch (err) {
        const messageText = err instanceof Error ? err.message : 'Trợ lý đang gặp sự cố, vui lòng thử lại sau.';
        updateAssistant((message) => ({ ...message, content: messageText, isStreaming: false }));
      } finally {
        setIsSending(false);
      }
    },
    [isSending, messages],
  );

  return { messages, sendMessage, isSending };
}
