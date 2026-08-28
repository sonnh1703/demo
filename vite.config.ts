import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin, type PluginOption } from 'vite';
import assistantHandler from './api/assistant';

// Trên Vercel, api/assistant.ts chạy như một Serverless Function riêng biệt.
// Plugin nhỏ này chỉ dùng lúc `vite dev` để gọi cùng một hàm đó, giúp trợ lý
// AI hoạt động ngay trên máy local mà không cần cài thêm CLI nào khác.
function assistantDevMiddleware(): Plugin {
  return {
    name: 'assistant-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/assistant', (req, res) => {
        assistantHandler(req, res).catch((error) => {
          console.error('[assistant] dev handler error', error);
          if (!res.headersSent) res.writeHead(500);
          res.end();
        });
      });
    },
  };
}

export default defineConfig(async ({ mode }) => {
  // Vite chỉ dùng .env để dựng import.meta.env cho client, KHÔNG tự gán vào
  // process.env của tiến trình Node — trong khi api/assistant.ts (và Vercel
  // khi deploy thật) đọc trực tiếp process.env. Gán bù ở đây để `npm run dev`
  // thấy được biến môi trường giống hệt lúc chạy trên Vercel.
  const env = loadEnv(mode, process.cwd(), '');
  for (const [key, value] of Object.entries(env)) {
    if (!(key in process.env)) process.env[key] = value;
  }

  const plugins: PluginOption[] = [react(), tailwindcss(), assistantDevMiddleware()];

  // Sites needs .openai/hosting.json, while Vercel builds should stay platform-native.
  if (!process.env.VERCEL) {
    const { sites } = await import('@openai/sites-vite-plugin');
    plugins.push(sites());
  }

  return { plugins };
});
