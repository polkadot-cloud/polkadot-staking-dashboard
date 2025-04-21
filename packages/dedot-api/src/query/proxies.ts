// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { StakingChain } from '../types'

export const proxies = async <T extends StakingChain>(
  api: DedotClient<T>,
  address: string
) => {
  const [result] = await api.query.proxy.proxies(address)

  // NOTE: Only returning the delegate accounts of any returned proxies
  return result.map((r) => r.delegate)
}
