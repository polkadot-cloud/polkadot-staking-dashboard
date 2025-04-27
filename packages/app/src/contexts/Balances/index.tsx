// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import {
  accountBalances$,
  defaultAccountBalance,
  defaultStakingLedger,
  stakingLedgers$,
} from 'global-bus'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { AccountBalance, MaybeAddress, StakingLedger } from 'types'
import type { BalancesContextInterface } from './types'

export const [BalancesContext, useBalances] =
  createSafeContext<BalancesContextInterface>()

export const BalancesProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork()
  const { getChainSpec } = useApi()
  const { existentialDeposit } = getChainSpec(network)

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
    return nominators?.targets || []
  }

  // Get an account's pending pool rewards from its staking ledger
  const getPendingPoolRewards = (address: MaybeAddress) => {
    if (!address) {
      return 0n
    }
    const { poolMembership } = getStakingLedger(address)
    return poolMembership?.pendingRewards || 0n
  }

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
        getPendingPoolRewards,
      }}
    >
      {children}
    </BalancesContext.Provider>
  )
}
