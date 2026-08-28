# Nexora Admin

Ứng dụng quản lý nội bộ, xây dựng bằng Vite + React + TypeScript (xem
`src/README.md` cho cấu trúc thư mục). Triển khai trên Vercel, tự động qua
`.github/workflows/deploy-vercel.yml` (xem `DEPLOYMENT.md`).

```
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + build production
```

## Trợ lý AI hướng dẫn sử dụng

Góc dưới bên phải mọi trang có một nút trợ lý (💬) giúp người dùng hỏi về
tính năng, đường dẫn và cách thao tác trên chính phần mềm này. Trợ lý **không**
truy vấn số liệu nghiệp vụ (doanh thu, đơn hàng...) và không thay thế tài liệu
hướng dẫn đầy đủ.

### Cấu hình (đổi nhà cung cấp LLM không cần sửa code)

Sao chép `.env.example` thành `.env` và điền 3 biến môi trường:

- `ASSISTANT_BASE_URL` — base URL endpoint tương thích OpenAI.
- `ASSISTANT_API_KEY` — API key, chỉ được đọc ở server (`api/assistant.ts`).
- `ASSISTANT_MODEL` — tên model.

`.env.example` có sẵn 2 preset (Groq, Gemini) kèm chú thích. Khi deploy trên
Vercel, khai báo 3 biến này trong **Project Settings → Environment Variables**
(xem thêm `DEPLOYMENT.md`).

`npm run dev` gọi được `/api/assistant` ngay trên máy local (không cần cài
`vercel` CLI) nhờ một plugin nhỏ trong `vite.config.ts` tái sử dụng cùng hàm xử
lý với Serverless Function trên Vercel (`api/assistant.ts`).

### Sửa nội dung trợ lý biết (không cần biết lập trình)

Toàn bộ kiến thức của trợ lý nằm trong một file duy nhất:
**`src/lib/assistant/feature-map.ts`**. Mỗi màn hình là một khối:

```ts
{
  name: 'Kho hàng',        // tên hiển thị
  path: '/inventory',      // đường dẫn thật của trang
  description: '...',      // mô tả ngắn
  actions: ['...'],        // các thao tác chính
  faqs: [{ question: '...', answer: '...' }],
}
```

Mở file, sửa/thêm nội dung theo đúng cấu trúc trên rồi lưu lại — không cần sửa
gì khác. Chỉ mô tả tính năng có thật đang hoạt động; trợ lý được yêu cầu không
bịa thêm tính năng ngoài file này.

### Kiến trúc (tóm tắt)

- `api/assistant.ts` — proxy phía server gọi LLM (API key không lộ ra client),
  stream phản hồi dạng SSE về widget.
- `src/lib/assistant/feature-map.ts` — dữ liệu (xem trên).
- `src/lib/assistant/system-prompt.ts` — ghép feature-map + quy tắc trả lời
  thành system prompt, kèm màn hình hiện tại (`pathname`).
- `src/lib/assistant/nav-parser.ts` — tách khối gợi ý điều hướng
  ```` ```nav [...] ``` ```` mà bot thêm ở cuối câu trả lời thành nút bấm.
- `src/components/assistant/` — widget chat (nút nổi + panel) và hook quản lý
  hội thoại (chỉ lưu trong bộ nhớ của phiên, mất khi tải lại trang).
- Widget được gắn trong `src/components/layout/app-layout.tsx`, nơi mọi route
  đều đi qua — nên xuất hiện trên toàn bộ ứng dụng.
