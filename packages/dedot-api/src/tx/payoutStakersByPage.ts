// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { StakingChain } from '../types'
import { asTx } from '../util'

export const payoutStakersByPage = <T extends StakingChain>(
  api: DedotClient<T>,
  validator: string,
  era: number,
  page: number
) => asTx(api.tx.staking.payoutStakersByPage(validator, era, page))
