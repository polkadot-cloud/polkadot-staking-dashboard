#!/usr/bin/env node
// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// This file is a shim that uses tsx to run the TypeScript CLI
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const args = process.argv.slice(2)
const cliPath = join(__dirname, '..', 'src', 'cli.ts')

const child = spawn('npx', ['tsx', cliPath, ...args], {
	stdio: 'inherit',
})

child.on('exit', (code) => {
	process.exit(code || 0)
})
