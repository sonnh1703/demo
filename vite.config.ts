import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type PluginOption } from 'vite';

export default defineConfig(async () => {
  const plugins: PluginOption[] = [react(), tailwindcss()];

  // Sites needs .openai/hosting.json, while Vercel builds should stay platform-native.
  if (!process.env.VERCEL) {
    const { sites } = await import('@openai/sites-vite-plugin');
    plugins.push(sites());
  }

  return { plugins };
});
