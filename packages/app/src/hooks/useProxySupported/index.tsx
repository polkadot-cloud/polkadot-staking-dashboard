// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { UnsupportedIfUniqueController } from 'consts/proxies'
import { isSupportedProxyCall } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBonded } from 'contexts/Bonded'
import { useProxies } from 'contexts/Proxies'
import type { UnsafeTx } from 'hooks/useSubmitExtrinsic/types'
import type { AnyJson, MaybeAddress } from 'types'

export const useProxySupported = () => {
  const { getBondedAccount } = useBonded()
  const { getProxyDelegate } = useProxies()
  const { activeProxy } = useActiveAccounts()

  // If call is from controller, & controller is different from stash, then proxy is not
  // supported.
  const controllerNotSupported = (c: string, f: MaybeAddress) =>
    UnsupportedIfUniqueController.includes(c) && getBondedAccount(f) !== f

  // Determine whether the provided tx is proxy supported.
  const isProxySupported = (tx: UnsafeTx, delegator: MaybeAddress) => {
    if (!tx) {
      return false
    }
    // if already wrapped, return.
    if (
      tx?.decodedCall?.type === 'Proxy' &&
      tx?.decodedCall?.value?.type === 'proxy'
    ) {
      return true
    }

    const proxyDelegate = getProxyDelegate(delegator, activeProxy)
    const proxyType = proxyDelegate?.proxyType || ''
    const pallet: string = tx?.decodedCall?.type || ''
    const method: string = tx?.decodedCall?.value?.type || ''
    const call = `${pallet}.${method}`

    // If a batch call, test if every inner call is a supported proxy call.
    if (call === 'Utility.batch') {
      return (tx?.decodedCall?.value?.value?.calls || [])
        .map((c: AnyJson) => ({
          pallet: c.type,
          method: c.value.type,
        }))
        .every(
          (c: AnyJson) =>
            (isSupportedProxyCall(proxyType, c.pallet, c.method) ||
              (c.pallet === 'Proxy' && c.method === 'proxy')) &&
            !controllerNotSupported(`${pallet}.${method}`, delegator)
        )
    }

    // Check if the current call is a supported proxy call.
    return (
      isSupportedProxyCall(proxyType, pallet, method) &&
      !controllerNotSupported(call, delegator)
    )
  }

  return {
    isProxySupported,
  }
}
