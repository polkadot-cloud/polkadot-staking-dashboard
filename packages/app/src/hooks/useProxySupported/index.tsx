// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { UnsupportedIfUniqueController } from 'consts/proxies'
import { isSupportedProxyCall } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useProxies } from 'contexts/Proxies'
import type { SubmittableExtrinsic } from 'dedot'
import type { AnyJson, MaybeAddress } from 'types'

export const useProxySupported = () => {
  const { getProxyDelegate } = useProxies()
  const { activeProxy } = useActiveAccounts()
  const { getStakingLedger } = useBalances()

  // Check if the controller account of sender is unmigrated
  const unmigratedController = (c: string, f: MaybeAddress) => {
    const { controllerUnmigrated } = getStakingLedger(f)
    return UnsupportedIfUniqueController.includes(c) && controllerUnmigrated
  }

  // Determine whether the provided tx is proxy supported
  const isProxySupported = (
    tx: SubmittableExtrinsic | undefined,
    delegator: MaybeAddress
  ) => {
    const proxyDelegate = getProxyDelegate(
      delegator,
      activeProxy?.address || null
    )
    if (!tx || !proxyDelegate) {
      return false
    }

    // if already wrapped in a proxy call, return early
    if (tx.call.pallet === 'Proxy' && tx.call.palletCall.name === 'Proxy') {
      return true
    }

    const proxyType = proxyDelegate.proxyType
    const pallet: string = tx.call.pallet
    const method: string = tx.call.palletCall.name
    const call = `${pallet}.${method}`

    // If a batch call, test if every inner call is a supported proxy call
    if (call === 'Utility.Batch') {
      return (tx.call.palletCall.params.calls || [])
        .map((c: AnyJson) => ({
          pallet: c.pallet,
          method: c.palletCall.name,
        }))
        .every(
          (c: AnyJson) =>
            (isSupportedProxyCall(proxyType, c.pallet, c.palletCall.name) ||
              (c.pallet === 'Proxy' && c.palletCall.name === 'Proxy')) &&
            !unmigratedController(`${c.pallet}.${c.palletCall.name}`, delegator)
        )
    }

    // Check if the non-batch call is a supported proxy call
    return (
      isSupportedProxyCall(proxyType, pallet, method) &&
      !unmigratedController(call, delegator)
    )
  }

  return {
    isProxySupported,
  }
}
