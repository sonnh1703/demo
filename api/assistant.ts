import type { IncomingMessage, ServerResponse } from 'node:http';
import { buildSystemPrompt } from '../src/lib/assistant/system-prompt.js';

// Proxy phía server cho trợ lý AI hướng dẫn sử dụng.
//
// Trên Vercel, file này chạy như một Serverless Function (Node.js runtime)
// nhờ nằm trong thư mục /api ở gốc dự án — không cần Next.js. Khi chạy `vite
// dev` ở máy local, cùng hàm này được gắn vào dev server qua vite.config.ts để
// `npm run dev` cũng gọi được /api/assistant mà không cần thêm công cụ nào.
//
// API key chỉ được đọc ở đây (process.env, phía server) — không bao giờ lọt
// vào bundle gửi cho trình duyệt.

type ChatRole = 'user' | 'assistant';
interface ChatMessage {
  role: ChatRole;
  content: string;
}

const MAX_HISTORY_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString('utf-8');
  return raw ? JSON.parse(raw) : {};
}

// Chỉ giữ lại tin nhắn của user/assistant, chặn client tự chèn role "system"
// để ghi đè quy tắc trong system-prompt.ts, đồng thời giới hạn độ dài để
// tránh lạm dụng.
function sanitizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is ChatMessage => {
      const candidate = item as Partial<ChatMessage> | null;
      return (candidate?.role === 'user' || candidate?.role === 'assistant') && typeof candidate.content === 'string';
    })
    .slice(-MAX_HISTORY_MESSAGES)
    .map((item) => ({ role: item.role, content: item.content.slice(0, MAX_MESSAGE_LENGTH) }));
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

export default async function assistantHandler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const baseUrl = process.env.ASSISTANT_BASE_URL;
  const apiKey = process.env.ASSISTANT_API_KEY;
  const model = process.env.ASSISTANT_MODEL;
  if (!baseUrl || !apiKey || !model) {
    sendJson(res, 500, {
      error: 'Trợ lý chưa được cấu hình. Vui lòng khai báo ASSISTANT_BASE_URL, ASSISTANT_API_KEY và ASSISTANT_MODEL.',
    });
    return;
  }

  let body: unknown;
  try {
    body = await readJsonBody(req);
  } catch {
    sendJson(res, 400, { error: 'Nội dung yêu cầu không hợp lệ.' });
    return;
  }

  const { messages: rawMessages, pathname } = (body ?? {}) as { messages?: unknown; pathname?: unknown };
  const history = sanitizeMessages(rawMessages);
  if (history.length === 0) {
    sendJson(res, 400, { error: 'Thiếu nội dung câu hỏi.' });
    return;
  }

  const systemPrompt = buildSystemPrompt(typeof pathname === 'string' ? pathname : '/');

  let upstream: Response;
  try {
    upstream = await fetch(`${baseUrl.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: 0.3,
        messages: [{ role: 'system', content: systemPrompt }, ...history],
      }),
    });
  } catch {
    sendJson(res, 502, { error: 'Không kết nối được tới dịch vụ trợ lý. Vui lòng thử lại sau.' });
    return;
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '');
    sendJson(res, 502, { error: 'Dịch vụ trợ lý phản hồi lỗi. Vui lòng thử lại sau.', detail: detail.slice(0, 500) });
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
  });

  const reader = upstream.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
  } finally {
    res.end();
  }
}
