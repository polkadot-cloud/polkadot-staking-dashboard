// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import type { ReactNode } from 'react'
import type { AllBalances, MaybeAddress } from 'types'
import { calculateAllBalances } from 'utils'
import type { TransferOptionsContextInterface } from './types'

export const [TransferOptionsContext, useTransferOptions] =
  createSafeContext<TransferOptionsContextInterface>()

export const TransferOptionsProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const {
    getPoolMembership,
    getStakingLedger,
    getAccountBalance,
    getEdReserved,
  } = useBalances()
  const { activeEra } = useApi()
  const { network } = useNetwork()
  const { feeReserve } = useBalances()
  const { activeAddress } = useActiveAccounts()
  const { units } = getStakingChainData(network)

  // Calculates various balances for an account pertaining to free balance, nominating and pools.
  // Gets balance numbers from `useBalances` state, which only takes the active accounts from
  // `Balances`
  const getAllBalances = (address: MaybeAddress): AllBalances => {
    const accountBalance = getAccountBalance(address)
    const stakingLedger = getStakingLedger(address)
    const { membership } = getPoolMembership(activeAddress)
    const edReserved = getEdReserved(address)
    const balances = calculateAllBalances(
      accountBalance,
      stakingLedger,
      membership,
      edReserved,
      feeReserve,
      activeEra.index
    )
    return balances
  }

  // Gets staked balance, whether nominating or in pool, for an account
  const getStakedBalance = (address: MaybeAddress) => {
    const allTransferOptions = getAllBalances(address)

    // Total funds nominating
    const nominating = planckToUnit(
      allTransferOptions.nominator.active +
        allTransferOptions.nominator.totalUnlocking +
        allTransferOptions.nominator.totalUnlocked,
      units
    )

    // Total funds in pool
    const inPool = planckToUnit(
      allTransferOptions.pool.active +
        allTransferOptions.pool.totalUnlocking +
        allTransferOptions.pool.totalUnlocked,
      units
    )

    // Determine the actual staked balance
    const nominatingBn = new BigNumber(nominating)
    const inPoolBn = new BigNumber(inPool)
    return !nominatingBn.isZero()
      ? nominatingBn
      : !inPoolBn.isZero()
        ? inPoolBn
        : new BigNumber(0)
  }

  return (
    <TransferOptionsContext.Provider
      value={{
        getAllBalances,
        getStakedBalance,
      }}
    >
      {children}
    </TransferOptionsContext.Provider>
  )
}
