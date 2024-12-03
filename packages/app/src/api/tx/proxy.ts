// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'common-types'

export class Proxy extends Base {
  #who: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #proxiedTx: any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(network: ChainId, who: string, proxiedTx: any) {
    super(network)
    this.#who = who
    this.#proxiedTx = proxiedTx
  }

  tx() {
    try {
      return this.unsafeApi.tx.Proxy.proxy({
        real: {
          type: 'Id',
          value: this.#who,
        },
        force_proxy_type: undefined,
        call: this.#proxiedTx.decodedCall,
      })
    } catch (e) {
      return null
    }
  }
}
