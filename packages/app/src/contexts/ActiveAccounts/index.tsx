// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { useNetwork } from 'contexts/Network'
import { activeProxy$, setActiveAddress } from 'global-bus'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { ActiveAccount, ActiveProxy } from 'types'
import type { ActiveAccountsContextInterface } from './types'

export const [ActiveAccountsContext, useActiveAccounts] =
  createSafeContext<ActiveAccountsContextInterface>()

export const ActiveAccountsProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const { network } = useNetwork()

  // Store the currently active account
  const [activeAccount, setActiveAccountState] = useState<ActiveAccount>(null)

  // Store the active proxy account
  const [activeProxy, setActiveProxy] = useState<ActiveProxy | null>(null)

  // Setter for the active account
  const setActiveAccount = (account: ActiveAccount, updateLocal = true) => {
    if (updateLocal) {
      if (account === null) {
        localStorage.removeItem(`${network}_active_account`)
      } else {
        localStorage.setItem(
          `${network}_active_account`,
          JSON.stringify(account)
        )
      }
    }
    // NOTE: Keep global bus in sync with the active account for dedot-api subscriptions
    setActiveAddress(account?.address || null)
    // Now update component state
    setActiveAccountState(account)
  }

  // Subscribe to global bus active proxy events
  useEffect(() => {
    const unsubActiveProxy = activeProxy$.subscribe((result) => {
      setActiveProxy(result)
    })
    return () => {
      unsubActiveProxy.unsubscribe()
    }
  }, [])

  return (
    <ActiveAccountsContext.Provider
      value={{
        activeAccount,
        activeAddress: activeAccount?.address || null,
        activeProxy,
        activeProxyType: activeProxy?.proxyType || null,
        setActiveAccount,
      }}
    >
      {children}
    </ActiveAccountsContext.Provider>
  )
}
