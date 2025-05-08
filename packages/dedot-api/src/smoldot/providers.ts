// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SmoldotProvider } from 'dedot'
import type { Client, SmoldotBytecode } from 'smoldot'
import { startWithBytecode } from 'smoldot/no-auto-bytecode'
import type { Network, SystemChain } from 'types'
import type { WorkerOpts } from './types'

// Instantiate smoldot from worker
const initSmWorker = () => {
  const smWorker = new Worker(new URL('./worker.js', import.meta.url), {
    type: 'module',
  })
  const client = doInitSmWorker(smWorker)
  return client
}

// Instantiate smoldot client
//
// Based on the example of smoldot from worker documentation at:
// <https://github.com/smol-dot/smoldot/tree/main/wasm-node/javascript#usage-with-a-worker>
export const doInitSmWorker = (
  worker: Worker,
  opts: WorkerOpts = {}
): Client => {
  const bytecode = new Promise<SmoldotBytecode>(
    (resolve) => (worker.onmessage = ({ data }) => resolve(data))
  )
  const { port1, port2: portToWorker } = new MessageChannel()
  worker.postMessage(port1, [port1])
  return startWithBytecode({ bytecode, portToWorker, ...opts })
}

// Instantiate a new relay chain smoldot provider
export const newRelayChainSmProvider = async (networkData: Network) => {
  const client = initSmWorker()
  const { chainSpec } = await networkData.endpoints.lightClient()
  const chain = await client.addChain({ chainSpec })
  return new SmoldotProvider(chain)
}

// Instantiate a new system chain smoldot provider
export const newSystemChainSmProvider = async (
  networkData: Network,
  systemChainData: SystemChain
) => {
  const client = initSmWorker()
  const { chainSpec } = await networkData.endpoints.lightClient()
  const { chainSpec: paraChainSpec } =
    await systemChainData.endpoints.lightClient()

  const chain = await client.addChain({
    chainSpec: paraChainSpec,
    potentialRelayChains: [await client.addChain({ chainSpec })],
  })
  return new SmoldotProvider(chain)
}
