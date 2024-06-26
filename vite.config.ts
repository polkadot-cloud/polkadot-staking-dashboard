// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
//
// - `BASE_URL`env variable is used in the codebase to refer to the supplied base.
export default defineConfig({
  plugins: [
    eslint(),
    react(),
    svgr(),
    tsconfigPaths(),
    checker({
      typescript: true,
    }),
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          '@substrate/connect': ['@substrate/connect'],
        },
      },
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
  optimizeDeps: {
    include: ['react/jsx-runtime'],
  },
  worker: {
    format: 'es',
  },
});
