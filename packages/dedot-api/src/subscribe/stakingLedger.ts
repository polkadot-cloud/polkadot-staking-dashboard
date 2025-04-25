// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { Unsub } from 'dedot/types'
import {
  addActivePoolId,
  removeActivePoolId,
  removeStakingLedger,
  setStakingLedger,
} from 'global-bus'
import type { StakingLedger } from 'types'
import type { StakingChain } from '../types'

export class StakingLedgerQuery<T extends StakingChain> {
  #unsub: Unsub | undefined = undefined
  #poolId: number | undefined = undefined

  constructor(
    public api: DedotClient<T>,
    public address: string
  ) {
    this.api = api
    this.subscribe()
  }

  async subscribe() {
    this.#unsub = await this.api.queryMulti(
      [
        {
          fn: this.api.query.staking.ledger,
          args: [this.address],
        },
        {
          fn: this.api.query.staking.payee,
          args: [this.address],
        },
        {
          fn: this.api.query.staking.nominators,
          args: [this.address],
        },
        {
          fn: this.api.query.nominationPools.poolMembers,
          args: [this.address],
        },
        {
          fn: this.api.query.nominationPools.claimPermissions,
          args: [this.address],
        },
      ],
      async ([ledger, payee, nominators, poolMember, claimPermission]) => {
        let balance = 0n
        let pendingRewards = 0n

        if (poolMember) {
          ;[balance, pendingRewards] = await Promise.all([
            this.api.call.nominationPoolsApi.pointsToBalance(
              poolMember.poolId,
              poolMember.points
            ),
            this.api.call.nominationPoolsApi.pendingRewards(this.address),
          ])
        }

        const stakingLedger: StakingLedger = {
          ledger:
            ledger === undefined
              ? undefined
              : {
                  stash: ledger.stash,
                  total: ledger.total,
                  active: ledger.active,
                  unlocking: ledger.unlocking.map(({ value, era }) => ({
                    value,
                    era,
                  })),
                },
          payee:
            payee === undefined
              ? undefined
              : {
                  destination: payee.type,
                  account: 'value' in payee ? payee.value : undefined,
                },
          nominators:
            nominators === undefined
              ? {
                  targets: [],
                  submittedIn: 0,
                }
              : {
                  targets: nominators.targets,
                  submittedIn: nominators.submittedIn,
                },
          poolMembership:
            poolMember === undefined
              ? undefined
              : {
                  address: this.address,
                  poolId: poolMember.poolId,
                  points: poolMember.points,
                  balance,
                  lastRecordedRewardCounter:
                    poolMember.lastRecordedRewardCounter,
                  unbondingEras: poolMember.unbondingEras,
                  claimPermission,
                  pendingRewards,
                },
        }
        setStakingLedger(this.address, stakingLedger)

        switch (this.getPoolIdUpdate(stakingLedger)) {
          case 'remove':
            if (this.#poolId) {
              removeActivePoolId(this.#poolId)
              this.#poolId = undefined
            }
            break
          case 'set':
            if (stakingLedger.poolMembership) {
              this.#poolId = stakingLedger.poolMembership.poolId
              addActivePoolId(this.#poolId)
            }
        }
      }
    )
  }

  getPoolIdUpdate = ({ poolMembership }: StakingLedger) => {
    const cur = poolMembership?.poolId
    return !cur && this.#poolId ? 'remove' : cur ? 'set' : undefined
  }

  unsubscribe() {
    this.#unsub?.()
    removeStakingLedger(this.address)

    if (this.#poolId) {
      removeActivePoolId(this.#poolId)
    }
  }
}
