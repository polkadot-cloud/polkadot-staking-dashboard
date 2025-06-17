// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import type { StakingContextInterface } from 'contexts/Staking/types'
import type { ReactNode } from 'react'

export const [StakingContext, useStaking] =
  createSafeContext<StakingContextInterface>()

export const StakingProvider = ({ children }: { children: ReactNode }) => {
  const { activeAddress } = useActiveAccounts()
  const { getStakingLedger, getNominations } = useBalances()

  // Helper function to determine whether the active account is bonding, or is yet to start
  const isBonding = (getStakingLedger(activeAddress).ledger?.active || 0n) > 0n

  // Helper function to determine whether the active account is nominating, or is yet to start
  const isNominating = getNominations(activeAddress).length > 0

  // Helper function to determine whether the active account is a nominator
  const isNominator = activeAddress !== null && isBonding && isNominating

  return (
    <StakingContext.Provider
      value={{
        isBonding,
        isNominating,
        isNominator,
      }}
    >
      {children}
    </StakingContext.Provider>
  )
}
