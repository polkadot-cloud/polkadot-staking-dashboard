// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SmoldotProvider } from 'dedot'
import type { Network, SystemChain } from 'types'
import { startFromWorker } from './start'

// Instantiate smoldot from worker
const initSmWorker = () => {
  const smWorker = new Worker(new URL('./worker.js', import.meta.url), {
    type: 'module',
  })
  const client = startFromWorker(smWorker)
  return client
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
