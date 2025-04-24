// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { getNetworkData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { ActivePools } from 'controllers/ActivePools'
import { Apis } from 'controllers/Apis'
import { Balances } from 'controllers/Balances'
import { isCustomEvent } from 'controllers/utils'
import {
  accountBalances$,
  defaultAccountBalance,
  defaultStakingLedger,
  stakingLedgers$,
} from 'global-bus'
import { useCreatePoolAccounts } from 'hooks/useCreatePoolAccounts'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import type {
  AccountBalance,
  ActivePoolItem,
  MaybeAddress,
  StakingLedger,
  SystemChainId,
} from 'types'
import { useEventListener } from 'usehooks-ts'
import type { BalancesContextInterface } from './types'

export const [BalancesContext, useBalances] =
  createSafeContext<BalancesContextInterface>()

export const BalancesProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork()
  const { isReady, getChainSpec } = useApi()
  const createPoolAccounts = useCreatePoolAccounts()
  const { existentialDeposit } = getChainSpec(network)
  const { ss58 } = getNetworkData(network)

  // Store account balances state
  type StateBalances = Record<string, Record<string, AccountBalance>>
  const [accountBalances, setAccountBalances] = useState<StateBalances>({})

  // Store staking ledgers state
  type StateLedgers = Record<string, StakingLedger>
  const [stakingLedgers, setStakingLedgers] = useState<StateLedgers>({})

  // Get an account balance for the default network chain
  const getAccountBalance = (address: MaybeAddress) => {
    if (!address) {
      return defaultAccountBalance
    }
    return accountBalances?.[network]?.[address] || defaultAccountBalance
  }

  // Get an account's ed reserved balance
  const getEdReserved = (address: MaybeAddress) => {
    const { maxLock } = getAccountBalance(address)
    const reserved = existentialDeposit - maxLock
    return reserved < 0 ? 0n : reserved
  }

  // Get an account's staking ledger
  const getStakingLedger = (address: MaybeAddress) => {
    if (!address) {
      return defaultStakingLedger
    }
    return stakingLedgers?.[address] || defaultStakingLedger
  }

  // Gets an account's nominations from its staking ledger
  const getNominations = (address: MaybeAddress) => {
    if (!address) {
      return []
    }
    const { nominators } = getStakingLedger(address)
    return (nominators?.targets || []).map((target) => target.address(ss58))
  }

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
    const unsubStakingLedgers = stakingLedgers$.subscribe((result) => {
      setStakingLedgers(result)
    })
    return () => {
      unsubBalances.unsubscribe()
      unsubStakingLedgers.unsubscribe()
    }
  }, [])

  return (
    <BalancesContext.Provider
      value={{
        getAccountBalance,
        getStakingLedger,
        getNominations,
        getEdReserved,
      }}
    >
      {children}
    </BalancesContext.Provider>
  )
}
