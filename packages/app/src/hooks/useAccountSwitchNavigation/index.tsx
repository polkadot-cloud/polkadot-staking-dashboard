// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useSyncing } from 'hooks/useSyncing'
import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const useAccountSwitchNavigation = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { activeAccount } = useActiveAccounts()
  const { getPoolMembership, getStakingLedger, getNominations } = useBalances()
  const { accountSynced } = useSyncing()

  // Track the previous account address to detect actual account switches
  const previousAccountRef = useRef<string | null>(null)

  useEffect(() => {
    if (!activeAccount?.address) {
      return
    }

    const address = activeAccount.address

    // Only redirect on actual account switch, not on manual navigation
    if (previousAccountRef.current === address) {
      return
    }

    // Update the previous account reference
    previousAccountRef.current = address

    // Wait for account data to be synced before making navigation decisions
    if (!accountSynced(address)) {
      return
    }

    // Helper function to check if an account is in a pool
    const isInPool = () => {
      const { membership } = getPoolMembership(address)
      return !!membership
    }

    // Helper function to check if an account is nominating (bonding + nominating)
    const isNominating = () => {
      const { ledger } = getStakingLedger(address)
      const nominations = getNominations(address)

      // Account is nominating if it has an active staking ledger and nominations
      const isBonding = (ledger?.active || 0n) > 0n
      const hasNominations = nominations.length > 0
      return isBonding && hasNominations
    }

    const accountInPool = isInPool()
    const accountNominating = isNominating()

    // Only redirect if we're on the relevant pages and the account state is clear
    if (pathname === '/pools' && accountNominating && !accountInPool) {
      // On pools page, switching to nominating account -> go to nominate page
      console.log('Navigating from pools to nominate')
      navigate('/nominate')
    } else if (
      pathname === '/nominate' &&
      accountInPool &&
      !accountNominating
    ) {
      // On nominate page, switching to pool member account -> go to pools page
      console.log('Navigating from nominate to pools')
      navigate('/pools')
    }
  }, [
    activeAccount,
    pathname,
    navigate,
    accountSynced,
    getPoolMembership,
    getStakingLedger,
    getNominations,
  ])
}
