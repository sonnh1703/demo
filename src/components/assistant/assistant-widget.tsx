import { useEffect, useRef, useState } from 'react';
import { MessageCircleQuestion, Send, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAssistantChat } from './use-assistant-chat';

const QUICK_QUESTIONS = ['Làm sao xem tồn kho?', 'Làm sao thêm đơn hàng mới?', 'Làm sao thêm người dùng mới?'];

// Bot hay trả lời kèm cú pháp Markdown đơn giản (**chữ đậm**). Widget không
// dùng thư viện Markdown đầy đủ — chỉ nhận diện **...** rồi dựng thẳng thành
// React node, nên không có rủi ro chèn HTML từ nội dung bot trả về.
function renderBoldText(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part,
  );
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { messages, sendMessage, isSending } = useAssistantChat(location.pathname);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const submit = (question: string) => {
    setDraft('');
    void sendMessage(question);
  };

  return (
    <>
      <button
        type="button"
        className="assistant-launcher"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? 'Đóng trợ lý hướng dẫn' : 'Mở trợ lý hướng dẫn'}
      >
        {open ? <X size={24} /> : <MessageCircleQuestion size={26} />}
      </button>

      {open && (
        <div className="assistant-panel" role="dialog" aria-label="Trợ lý hướng dẫn sử dụng">
          <div className="assistant-panel-header">
            <div>
              <strong>Trợ lý hướng dẫn</strong>
              <span>Hỏi về cách dùng phần mềm</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Đóng trợ lý">
              <X size={18} />
            </button>
          </div>

          <div className="assistant-messages" ref={listRef}>
            {messages.length === 0 && (
              <div className="assistant-empty">
                <p>Chào bạn! Tôi có thể giúp bạn tìm tính năng và hướng dẫn thao tác trên phần mềm này.</p>
                <div className="assistant-quick-questions">
                  {QUICK_QUESTIONS.map((question) => (
                    <button key={question} type="button" onClick={() => submit(question)}>
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={message.role === 'user' ? 'assistant-bubble assistant-bubble-user' : 'assistant-bubble assistant-bubble-bot'}
              >
                <p>{renderBoldText(message.content || (message.isStreaming ? 'Đang trả lời...' : ''))}</p>
                {message.navSuggestions && message.navSuggestions.length > 0 && (
                  <div className="assistant-nav-buttons">
                    {message.navSuggestions.map((suggestion) => (
                      <button key={suggestion.path} type="button" onClick={() => navigate(suggestion.path)}>
                        Đi tới {suggestion.label} →
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form
            className="assistant-input-bar"
            onSubmit={(event) => {
              event.preventDefault();
              if (draft.trim()) submit(draft);
            }}
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Nhập câu hỏi..."
              aria-label="Nhập câu hỏi cho trợ lý"
              disabled={isSending}
            />
            <button type="submit" aria-label="Gửi câu hỏi" disabled={isSending || !draft.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
