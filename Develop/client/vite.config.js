import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 10000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:1000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
