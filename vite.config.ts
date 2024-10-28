import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,            // Enable global test functions like describe, it, expect
    environment: "jsdom",      // Use jsdom for DOM-related tests
    setupFiles: "./src/setupTests.ts", // Optional: Path to a setup file if needed
    typecheck: {
      tsconfig: "./tsconfig.test.json", // Specify the test-specific tsconfig
    },
  },
})