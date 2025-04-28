// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { maxBigInt } from '@w3ux/utils'
import type { DedotClient } from 'dedot'
import type { Unsub } from 'dedot/types'
import { removeAccountBalance, setAccountBalance } from 'global-bus'
import type { AccountBalance, ChainId } from 'types'
import type { Chain } from '../types'

export class AccountBalanceQuery<T extends Chain> {
  #unsub: Unsub | undefined = undefined

  constructor(
    public api: DedotClient<T>,
    public chainId: ChainId,
    public address: string
  ) {
    this.api = api
    this.subscribe()
  }

  async subscribe() {
    this.#unsub = await this.api.query.system.account(
      this.address,
      ({ nonce, data }) => {
        // MIGRATION: Westend now factors staking amount into the free balance. Temporarily deduct
        // the max(frozen, reserved) from the free balance for other networks
        const isWestend = this.api.runtimeVersion.specName === 'westend'
        const free = isWestend
          ? data.free
          : maxBigInt(data.free - maxBigInt(data.reserved, data.frozen), 0n)

        const balances: AccountBalance = {
          nonce,
          balance: {
            free,
            reserved: data.reserved,
            frozen: data.frozen,
          },
        }
        setAccountBalance(this.chainId, this.address, balances)
      }
    )
  }

  unsubscribe() {
    this.#unsub?.()
    removeAccountBalance(this.chainId, this.address)
  }
}
