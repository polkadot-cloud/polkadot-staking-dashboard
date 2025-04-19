// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import BigNumber from 'bignumber.js'
import type { AnyApi } from 'common-types'
import type { ChainId } from 'types'
import { perbillToPercent } from 'utils'

export class BondedPoolsEntries extends Base {
  bondedPools: AnyApi = {}

  constructor(network: ChainId) {
    super(network)
  }

  async fetch() {
    this.bondedPools =
      await this.unsafeApi.query.NominationPools.BondedPools.getEntries({
        at: 'best',
      })
    return this
  }

  format(entry?: AnyApi) {
    return Object.fromEntries(
      (entry ? [entry] : this.bondedPools).map(
        ({ keyArgs, value }: { keyArgs: [number]; value: AnyApi }) => {
          const id = keyArgs[0]
          const pool = this.formatPool(value)
          return [id, pool]
        }
      )
    )
  }

  formatPool(value: AnyApi) {
    const maybeCommissionCurrent = value.commission.current
    const commissionCurrent = !maybeCommissionCurrent
      ? null
      : [
          perbillToPercent(maybeCommissionCurrent[0]).toString(),
          maybeCommissionCurrent[1],
        ]

    const commissionMax = value.commission.max
    const commissionMaxPercent = !commissionMax
      ? null
      : perbillToPercent(new BigNumber(value.commission.max))

    const commissionChangeRate = value.commission.change_rate

    const commission = {
      current: commissionCurrent,
      claimPermission: value.commission.claim_permission?.type || null,
      max: commissionMaxPercent,
      changeRate: commissionChangeRate || null,
      throttleFrom: value.commission.throttle_from || null,
    }

    const pool = {
      commission,
      points: value.points.toString(),
      memberCounter: value.member_counter.toString(),
      roles: value.roles,
      state: value.state.type,
    }

    return pool
  }
}
