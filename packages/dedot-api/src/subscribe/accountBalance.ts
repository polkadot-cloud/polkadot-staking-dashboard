// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { Unsub } from 'dedot/types'
import { hexToString } from 'dedot/utils'
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
    this.#unsub = await this.api.queryMulti(
      [
        {
          fn: this.api.query.system.account,
          args: [this.address],
        },
        {
          fn: this.api.query.balances.locks,
          args: [this.address],
        },
      ],
      ([{ nonce, data }, locks]) => {
        const balances: AccountBalance = {
          nonce,
          balance: {
            free: data.free,
            reserved: data.reserved,
            frozen: data.frozen,
          },
          locks: locks.map((lock) => ({
            id: hexToString(lock.id).trim(),
            amount: lock.amount,
          })),
          maxLock: locks.reduce(
            (prev, cur) => (prev > cur.amount ? prev : cur.amount),
            0n
          ),
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
