// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Proxy } from 'api/tx/proxy'
import type { AnyApi } from 'common-types'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { Apis } from 'controllers/Apis'
import { useProxySupported } from 'hooks/useProxySupported'
import type { UnsafeTx } from 'hooks/useSubmitExtrinsic/types'
import type { MaybeAddress } from 'types'

export const useBatchCall = () => {
  const { network } = useNetwork()
  const { activeProxy } = useActiveAccounts()
  const { isProxySupported } = useProxySupported()

  const newBatchCall = (txs: UnsafeTx[], from: MaybeAddress): AnyApi => {
    const api = Apis.getApi(network)

    from = from || ''
    const batchTx = api.tx.Utility.batch({
      calls: txs.map((tx) => tx.decodedCall),
    })

    if (activeProxy && isProxySupported(batchTx, from)) {
      return api.tx.Utility.batch({
        calls: txs
          .map((tx) => new Proxy(network, from, tx).tx()?.decodedCall)
          .filter((tx) => tx !== null),
      })
    }
    return batchTx
  }

  return {
    newBatchCall,
  }
}
