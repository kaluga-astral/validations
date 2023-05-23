/// <reference types="vitest" />

import path from 'path';

// eslint-disable-next-line import/no-extraneous-dependencies
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: path.resolve(__dirname, 'vitest.setup.js'),
  },
});
