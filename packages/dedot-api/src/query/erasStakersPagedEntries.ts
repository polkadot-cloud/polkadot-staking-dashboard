// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import { AccountId32 } from 'dedot/codecs'
import type { StakingChain } from '../types'

export const erasStakersPagedEntries = async <T extends StakingChain>(
  api: DedotClient<T>,
  era: number,
  validator: string
) =>
  await api.query.staking.erasStakersPaged.entries(
    era,
    new AccountId32(validator)
  )
