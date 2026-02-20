import { defineConfig } from 'vitest/config' // ✅ Cambiado de 'vite' a 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom", // ✅ Esto habilita window y localStorage en los tests
    globals: true,        // ✅ Permite usar 'test', 'expect', 'vi' sin importarlos
    setupFiles: "./src/tests/setupTests.js",
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      thresholds: { // ✅ En versiones recientes de Vitest, los límites van dentro de thresholds
        lines: 75,
        functions: 75,
        branches: 75,
        statements: 75,
      }
    },
  },
})