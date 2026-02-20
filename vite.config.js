import { defineConfig } from 'vitest/config' 
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom", 
    globals: true,        
    setupFiles: "./src/tests/setupTests.js",
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      thresholds: {
        lines: 75,
        functions: 75,
        branches: 75,
        statements: 75,
      }
    },
  },
})