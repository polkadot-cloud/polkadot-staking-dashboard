// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SmoldotProvider } from 'dedot'
import { startWithWorker } from 'dedot/smoldot/with-worker'
import type { Network, SystemChain } from 'types'

// Instantiate smoldot from worker
const initSmWorker = () => {
  const client = startWithWorker(
    new Worker(new URL('dedot/smoldot/worker', import.meta.url), {
      type: 'module',
    })
  )
  return client
}

// Instantiate a new relay chain smoldot provider
export const newRelayChainSmProvider = async (networkData: Network) => {
  const client = initSmWorker()
  const { chainSpec } = await networkData.endpoints.getLightClient()
  const chain = await client.addChain({ chainSpec })
  return new SmoldotProvider(chain)
}

// Instantiate a new system chain smoldot provider
export const newSystemChainSmProvider = async (
  networkData: Network,
  systemChainData: SystemChain
) => {
  const client = initSmWorker()
  const { chainSpec } = await networkData.endpoints.getLightClient()
  const { chainSpec: paraChainSpec } =
    await systemChainData.endpoints.getLightClient()

  const chain = await client.addChain({
    chainSpec: paraChainSpec,
    potentialRelayChains: [await client.addChain({ chainSpec })],
  })
  return new SmoldotProvider(chain)
}
