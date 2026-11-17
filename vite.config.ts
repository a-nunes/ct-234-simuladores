/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@features': r('./src/features'),
      '@shared': r('./src/shared'),
    },
  },
  server: {
    // Dev server só escuta em loopback por padrão; nunca exponha o dev server.
    host: '127.0.0.1',
    port: 3000,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
  build: {
    outDir: 'build',
    // Não publica source maps em produção (evita expor o código-fonte original).
    sourcemap: false,
    target: 'es2022',
    // Evita inlining de assets como data: URIs, mantendo a CSP sem "data:".
    assetsInlineLimit: 0,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    // Equivalente ao "resetMocks: true" que o CRA/Jest aplicava por padrão.
    mockReset: true,
    css: false,
  },
});
