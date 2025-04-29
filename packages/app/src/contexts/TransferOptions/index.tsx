// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import { maxBigInt, planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { getUnlocking } from 'contexts/Balances/Utils'
import { useNetwork } from 'contexts/Network'
import type { ReactNode } from 'react'
import { useState } from 'react'
import type { MaybeAddress } from 'types'
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
  const { getStakingLedger, getAccountBalance, getEdReserved } = useBalances()

  const { poolMembership } = getStakingLedger(activeAddress)
  const { units, defaultFeeReserve } = getNetworkData(network)

  // A user-configurable reserve amount to be used to pay for transaction fees
  const [feeReserve, setFeeReserve] = useState<bigint>(
    getLocalFeeReserve(activeAddress, defaultFeeReserve, { network, units })
  )

  // Calculates various balances for an account pertaining to free balance, nominating and pools.
  // Gets balance numbers from `useBalances` state, which only takes the active accounts from
  // `Balances`
  const getTransferOptions = (address: MaybeAddress): TransferOptions => {
    const {
      balance: { free, frozen, reserved },
    } = getAccountBalance(address)

    const stakingLedger = getStakingLedger(address)
    const { active, total } = stakingLedger.ledger || {
      active: 0n,
      total: 0n,
    }
    const unlocking = stakingLedger?.ledger?.unlocking || []
    const maxReserve = maxBigInt(frozen, reserved)

    // Calculate a forced amount of free balance that needs to be reserved to keep the account
    // alive. Deducts `locks` from free balance reserve needed
    const edReserved = getEdReserved(address)
    const freeBalance = maxBigInt(free - edReserved, 0n)

    // Total free balance after reserved amount of ed is subtracted
    const transferrableBalance = maxBigInt(
      freeBalance - edReserved - feeReserve,
      0n
    )
    // Free balance to pay for tx fees
    const balanceTxFees = maxBigInt(free - edReserved, 0n)

    // Total amount unlocking and unlocked.
    const { totalUnlocking, totalUnlocked } = getUnlocking(
      unlocking,
      activeEra.index
    )

    const nominatorBalances = () => {
      const totalPossibleBond = total + transferrableBalance

      return {
        active,
        totalUnlocking,
        totalUnlocked,
        totalPossibleBond,
        totalAdditionalBond: maxBigInt(totalPossibleBond - total, 0n),
        totalUnlockChunks: unlocking.length,
      }
    }

    const poolBalances = () => {
      const unlockingPool = (poolMembership?.unbondingEras || []).map(
        ([era, value]) => ({
          era,
          value,
        })
      )
      const {
        totalUnlocking: totalUnlockingPool,
        totalUnlocked: totalUnlockedPool,
      } = getUnlocking(unlockingPool, activeEra.index)

      return {
        active: poolMembership?.balance || 0n,
        totalUnlocking: totalUnlockingPool,
        totalUnlocked: totalUnlockedPool,
        totalPossibleBond: maxBigInt(transferrableBalance - maxReserve, 0n),
        totalUnlockChunks: unlockingPool.length,
      }
    }

    return {
      freeBalance,
      transferrableBalance,
      balanceTxFees,
      edReserved,
      nominate: nominatorBalances(),
      pool: poolBalances(),
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
