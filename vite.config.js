import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    // SPA fallback: serve index.html for client-side routes
    {
      name: 'spa-fallback',
      configResolved(config) {
        this.config = config;
      },
      apply: 'serve',
      enforce: 'post',
      configureServer(server) {
        return () => {
          server.middlewares.use((req, res, next) => {
            // Allow API and static assets to pass through
            if (req.url.includes('.') || req.url.startsWith('/api') || req.url.startsWith('/@')) {
              return next();
            }
            // For SPA routes without file extensions, serve index.html
            req.url = '/';
            next();
          });
        };
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
