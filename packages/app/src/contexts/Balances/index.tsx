// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBonded } from 'contexts/Bonded'
import { useNetwork } from 'contexts/Network'
import { ActivePools } from 'controllers/ActivePools'
import { Apis } from 'controllers/Apis'
import { Balances } from 'controllers/Balances'
import { isCustomEvent } from 'controllers/utils'
import { accountBalances$, defaultAccountBalance } from 'global-bus'
import { useActiveBalances } from 'hooks/useActiveBalances'
import { useCreatePoolAccounts } from 'hooks/useCreatePoolAccounts'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import type {
  AccountBalance,
  ActivePoolItem,
  MaybeAddress,
  SystemChainId,
} from 'types'
import { useEventListener } from 'usehooks-ts'
import type { BalancesContextInterface } from './types'

export const [BalancesContext, useBalances] =
  createSafeContext<BalancesContextInterface>()

export const BalancesProvider = ({ children }: { children: ReactNode }) => {
  const { isReady } = useApi()
  const { network } = useNetwork()
  const { getBondedAccount } = useBonded()
  const createPoolAccounts = useCreatePoolAccounts()
  const { activeAddress, activeProxy } = useActiveAccounts()
  const controller = getBondedAccount(activeAddress)

  // Store account balances state
  type State = Record<string, Record<string, AccountBalance>>
  const [accountBalances, setAccountBalances] = useState<State>({})

  // Get an account balance for the default network chain
  const getAccountBalance = (address: MaybeAddress) => {
    if (!address) {
      return defaultAccountBalance
    }
    return accountBalances?.[network]?.[address] || defaultAccountBalance
  }

  // Listen to balance updates for the active account, active proxy and controller
  const {
    getLedger,
    getPayee,
    getPoolMembership,
    getNominations,
    getEdReserved,
  } = useActiveBalances({
    accounts: [activeAddress, activeProxy?.address || null, controller],
  })

  // Check all accounts have been synced. App-wide syncing state for all accounts
  const newAccountBalancesCallback = (e: Event) => {
    if (isCustomEvent(e) && Balances.isValidNewAccountBalanceEvent(e)) {
      const { address, ...newBalances } = e.detail
      const { poolMembership } = newBalances

      // If a pool membership exists, let `ActivePools` know of pool membership to re-sync pool
      // details and nominations
      if (isReady) {
        let newPools: ActivePoolItem[] = []
        if (poolMembership) {
          const { poolId } = poolMembership
          newPools = ActivePools.getformattedPoolItems(address).concat({
            id: String(poolId),
            addresses: { ...createPoolAccounts(Number(poolId)) },
          })
        }

        const peopleApi = Apis.getApi(`people-${network}` as SystemChainId)
        if (peopleApi) {
          ActivePools.syncPools(network, address, newPools)
        }
      }
    }
  }

  const documentRef = useRef<Document>(document)

  // Listen for new account balance events
  useEventListener(
    'new-account-balance',
    newAccountBalancesCallback,
    documentRef
  )

  // Subscribe to global bus account balance events
  useEffect(() => {
    const unsubBalances = accountBalances$.subscribe((result) => {
      setAccountBalances(result)
    })
    return () => {
      unsubBalances.unsubscribe()
    }
  }, [])

  return (
    <BalancesContext.Provider
      value={{
        getAccountBalance,
        getLedger,
        getPayee,
        getPoolMembership,
        getNominations,
        getEdReserved,
      }}
    >
      {children}
    </BalancesContext.Provider>
  )
}
