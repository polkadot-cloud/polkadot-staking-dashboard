// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { StakingChain } from '../types'

export const erasValidatorRewardMulti = async <T extends StakingChain>(
  api: DedotClient<T>,
  eras: number[]
) => await api.query.staking.erasValidatorReward.multi(eras)
