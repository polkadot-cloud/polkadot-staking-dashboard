// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'common-types'
import { Binary } from 'polkadot-api'
import type { PoolRoles } from 'types'

export class CreatePool extends Base {
  #from: string
  #poolId: number
  #bond: bigint
  #metadata: string
  #nominees: string[]
  #roles?: PoolRoles | null

  constructor(
    network: ChainId,
    from: string,
    poolId: number,
    bond: bigint,
    metadata: string,
    nominees: string[],
    roles: PoolRoles | null
  ) {
    super(network)
    this.#from = from
    this.#poolId = poolId
    this.#bond = bond
    this.#metadata = metadata
    this.#nominees = nominees
    this.#roles = roles
  }

  tx() {
    const root = this.#roles?.root || this.#from
    const nominator = this.#roles?.nominator || this.#from
    const bouncer = this.#roles?.bouncer || this.#from

    try {
      return [
        this.unsafeApi.tx.NominationPools.create({
          amount: this.#bond,
          root: {
            type: 'Id',
            value: root,
          },
          nominator: {
            type: 'Id',
            value: nominator,
          },
          bouncer: {
            type: 'Id',
            value: bouncer,
          },
        }),

        this.unsafeApi.tx.NominationPools.nominate({
          pool_id: this.#poolId,
          validators: this.#nominees,
        }),
        this.unsafeApi.tx.NominationPools.set_metadata({
          pool_id: this.#poolId,
          metadata: Binary.fromText(this.#metadata),
        }),
      ]
    } catch (e) {
      return null
    }
  }
}
