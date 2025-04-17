// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ClaimPermission } from 'contexts/Pools/types'
import type { ChainId } from 'types'

export class PoolSetClaimPermission extends Base {
  #claimPermission: ClaimPermission

  constructor(network: ChainId, claimPermission: ClaimPermission) {
    super(network)
    this.#claimPermission = claimPermission
  }

  tx() {
    try {
      return this.unsafeApi.tx.NominationPools.set_claim_permission({
        permission: {
          type: this.#claimPermission,
          value: undefined,
        },
      })
    } catch (e) {
      return null
    }
  }
}
