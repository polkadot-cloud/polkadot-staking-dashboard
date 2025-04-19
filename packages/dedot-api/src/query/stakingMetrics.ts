// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { Unsub } from 'dedot/types'
import { defaultStakingMetrics, setStakingMetrics } from 'global-bus'
import type { ActiveEra, StakingMetrics } from 'types'
import type { StakingChain } from '../types'

export class StakingMetricsQuery<T extends StakingChain> {
  stakingMetrics: StakingMetrics = defaultStakingMetrics

  #unsub: Unsub | undefined = undefined

  constructor(
    public api: DedotClient<T>,
    public activeEra: ActiveEra
  ) {
    this.api = api
    this.subscribe()
  }

  async subscribe() {
    this.#unsub = await this.api.queryMulti(
      [
        {
          fn: this.api.query.fastUnstake.erasToCheckPerBlock,
          args: [],
        },
        {
          fn: this.api.query.staking.minimumActiveStake,
          args: [],
        },
        {
          fn: this.api.query.staking.counterForValidators,
          args: [],
        },
        {
          fn: this.api.query.staking.maxValidatorsCount,
          args: [],
        },
        {
          fn: this.api.query.staking.validatorCount,
          args: [],
        },
        {
          fn: this.api.query.staking.erasValidatorReward,
          args: [this.activeEra.index - 1],
        },
        {
          fn: this.api.query.staking.erasTotalStake,
          args: [Math.max(this.activeEra.index - 1, 0)],
        },
        {
          fn: this.api.query.staking.minNominatorBond,
          args: [],
        },
        {
          fn: this.api.query.staking.erasTotalStake,
          args: [this.activeEra.index],
        },
        {
          fn: this.api.query.staking.counterForNominators,
          args: [],
        },
      ],
      ([
        erasToCheckPerBlock,
        minimumActiveStake,
        counterForValidators,
        maxValidatorsCount,
        validatorCount,
        lastReward,
        lastTotalStake,
        minNominatorBond,
        totalStaked,
        counterForNominators,
      ]) => {
        this.stakingMetrics = {
          erasToCheckPerBlock,
          minimumActiveStake,
          counterForValidators,
          maxValidatorsCount,
          validatorCount,
          lastReward,
          lastTotalStake,
          minNominatorBond,
          totalStaked,
          counterForNominators,
        }
        setStakingMetrics(this.stakingMetrics)
      }
    )
  }

  unsubscribe() {
    this.#unsub?.()
  }
}
