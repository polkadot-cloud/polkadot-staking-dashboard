// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/check-rpc.ts'],
  outDir: 'dist',
  format: ['esm'],
  platform: 'node',
  bundle: true,
  clean: true,
  noExternal: ['consts'],
})
