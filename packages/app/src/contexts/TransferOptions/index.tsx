// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import { planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import type { ReactNode } from 'react'
import { useState } from 'react'
import type { MaybeAddress } from 'types'
import { getAllBalances } from 'utils'
import type { TransferOptions, TransferOptionsContextInterface } from './types'
import { getLocalFeeReserve, setLocalFeeReserve } from './Utils'

export const [TransferOptionsContext, useTransferOptions] =
  createSafeContext<TransferOptionsContextInterface>()

export const TransferOptionsProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const { activeEra } = useApi()
  const { network } = useNetwork()
  const { activeAddress } = useActiveAccounts()
  const {
    getPoolMembership,
    getStakingLedger,
    getAccountBalance,
    getEdReserved,
  } = useBalances()

  const { membership } = getPoolMembership(activeAddress)
  const { units, defaultFeeReserve } = getStakingChainData(network)

  // A user-configurable reserve amount to be used to pay for transaction fees
  const [feeReserve, setFeeReserve] = useState<bigint>(
    getLocalFeeReserve(activeAddress, defaultFeeReserve, { network, units })
  )

  // Calculates various balances for an account pertaining to free balance, nominating and pools.
  // Gets balance numbers from `useBalances` state, which only takes the active accounts from
  // `Balances`
  const getTransferOptions = (address: MaybeAddress): TransferOptions => {
    const accountBalance = getAccountBalance(address)
    const stakingLedger = getStakingLedger(address)
    const edReserved = getEdReserved(address)

    const balances = getAllBalances(
      accountBalance,
      stakingLedger,
      membership,
      edReserved,
      feeReserve,
      activeEra.index
    )

    return {
      freeBalance: balances.freeBalance,
      transferrableBalance: balances.transferableBalance,
      balanceTxFees: balances.balanceTxFees,
      edReserved: balances.edReserved,
      nominate: {
        active: balances.nominator.active,
        totalUnlocking: balances.nominator.totalUnlocking,
        totalUnlocked: balances.nominator.totalUnlocked,
        totalPossibleBond: balances.nominator.totalPossibleBond,
        totalAdditionalBond: balances.nominator.totalAdditionalBond,
        totalUnlockChunks: balances.nominator.totalUnlockChunks,
      },
      pool: {
        active: balances.pool.active,
        totalUnlocking: balances.pool.totalUnlocking,
        totalUnlocked: balances.pool.totalUnlocked,
        totalPossibleBond: balances.pool.totalPossibleBond,
        totalUnlockChunks: balances.pool.totalUnlockChunks,
      },
    }
  }

  // Updates account's reserve amount in state and in local storage
  const setFeeReserveBalance = (amount: bigint) => {
    if (!activeAddress) {
      return
    }
    setLocalFeeReserve(activeAddress, amount, network)
    setFeeReserve(amount)
  }

  // Gets staked balance, whether nominating or in pool, for an account
  const getStakedBalance = (address: MaybeAddress) => {
    const allTransferOptions = getTransferOptions(address)

    // Total funds nominating
    const nominating = planckToUnit(
      allTransferOptions.nominate.active +
        allTransferOptions.nominate.totalUnlocking +
        allTransferOptions.nominate.totalUnlocked,
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

  // Gets a fee reserve value from local storage for an account, or the default value otherwise
  const getFeeReserve = (address: MaybeAddress): bigint =>
    getLocalFeeReserve(address, defaultFeeReserve, { network, units })

  // Update an account's reserve amount on account or network change
  useEffectIgnoreInitial(() => {
    setFeeReserve(
      getLocalFeeReserve(activeAddress, defaultFeeReserve, { network, units })
    )
  }, [activeAddress, network])

  return (
    <TransferOptionsContext.Provider
      value={{
        getTransferOptions,
        getStakedBalance,
        setFeeReserveBalance,
        feeReserve,
        getFeeReserve,
      }}
    >
      {children}
    </TransferOptionsContext.Provider>
  )
}
