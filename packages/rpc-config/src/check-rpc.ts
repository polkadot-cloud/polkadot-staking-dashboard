// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkList, SystemChainList } from 'consts/networks'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// JSON to commit to file
const resultJson: Record<string, Record<string, string>> = {}

// Just mark all RPC endpoints as `ok` for now while checking CI
//
// TODO: Plug real check logic in here
const generateJson = (rpc: Record<string, string>) => {
  const thisResult: Record<string, string> = {}
  for (const [key] of Object.entries(rpc)) {
    thisResult[key] = 'ok'
  }
  return thisResult
}
// Check relay chain RPC endpoints
for (const [
  id,
  {
    endpoints: { rpc },
  },
] of Object.entries(NetworkList)) {
  resultJson[id] = generateJson(rpc)
}

// Check system chain RPC endpoints
for (const [
  id,
  {
    endpoints: { rpc },
  },
] of Object.entries(SystemChainList)) {
  resultJson[id] = generateJson(rpc)
}

// Ensure output directory exists
fs.mkdirSync(path.resolve(__dirname, '../../src/_generated'), {
  recursive: true,
})

// Write results to file
fs.writeFileSync(
  path.resolve(__dirname, '../../src/_generated/index.json'),
  JSON.stringify(resultJson, null, 2)
)
