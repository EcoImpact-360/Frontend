import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/tests/setupTests.js",
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      lines: 75,
      functions: 75,
      branches: 75,
      statements: 75,
    },
  },
})
