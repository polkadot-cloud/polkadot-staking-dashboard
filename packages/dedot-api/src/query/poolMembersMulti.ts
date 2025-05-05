// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { StakingChain } from '../types'

export const poolMembersMulti = async <T extends StakingChain>(
  api: DedotClient<T>,
  addresses: string[]
) => await api.query.nominationPools.poolMembers.multi(addresses)
