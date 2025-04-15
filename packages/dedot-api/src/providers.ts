// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SmoldotProvider } from 'dedot'
import * as smoldot from 'smoldot'
import type { Network, SystemChain } from 'types'

// Instantiate a new relay chain smoldot provider
export const newRelayProvider = async (networkData: Network) => {
  const client = smoldot.start()
  const { chainSpec } = await networkData.endpoints.lightClient()
  const chain = await client.addChain({ chainSpec })
  return new SmoldotProvider(chain)
}

// Instantiate a new system chain smoldot provider
export const newSystemChainProvider = async (
  networkData: Network,
  systemChainData: SystemChain
) => {
  const client = smoldot.start()
  const { chainSpec } = await networkData.endpoints.lightClient()
  const { chainSpec: paraChainSpec } =
    await systemChainData.endpoints.lightClient()

  const chain = await client.addChain({
    chainSpec: paraChainSpec,
    potentialRelayChains: [await client.addChain({ chainSpec })],
  })
  return new SmoldotProvider(chain)
}
