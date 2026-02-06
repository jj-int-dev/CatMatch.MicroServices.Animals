import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'src/server.ts', // Only starts server, excluded
        'src/database-migrations/**', // Generated schema files
        'src/config/**', // Configuration files
        '**/*.d.ts', // Type definitions
        '**/types/**',
        '**/*.config.ts',
        'vitest.config.ts',
        'drizzle*.config.ts',
        'eslint.config.js'
      ],
      include: ['src/**/*.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    },
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    setupFiles: ['./tests/setup.ts']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
