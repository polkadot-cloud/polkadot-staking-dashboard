// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks'
import type { MaybeString } from '@w3ux/types'
import { setStateWithRef } from '@w3ux/utils'
import type {
  ActiveBalancesState,
  ActiveLedgerSource,
  Ledger,
} from 'contexts/Balances/types'
import { useNetwork } from 'contexts/Network'
import type { PoolMembership } from 'contexts/Pools/types'
import type { PayeeConfig } from 'contexts/Setup/types'
import { Balances } from 'controllers/Balances'
import { defaultLedger, defaultPayee } from 'controllers/Balances/defaults'
import { isCustomEvent } from 'controllers/utils'
import { useEffect, useRef, useState } from 'react'
import type { Targets } from 'types'
import { useEventListener } from 'usehooks-ts'

export const useActiveBalances = ({
  accounts,
}: {
  accounts: MaybeString[]
}) => {
  const { network } = useNetwork()

  // Ensure no account duplicates
  const uniqueAccounts = [...new Set(accounts)]

  // Store active account balances state. Requires ref for use in event listener callbacks
  const [activeBalances, setActiveBalances] = useState<ActiveBalancesState>({})
  const activeBalancesRef = useRef(activeBalances)

  // Gets a ledger for a stash address
  const getLedger = (source: ActiveLedgerSource): Ledger => {
    if ('stash' in source) {
      const stash = source['stash']
      return (
        Object.values(activeBalances).find(
          (activeBalance) => activeBalance.ledger?.['stash'] === stash
        )?.ledger || defaultLedger
      )
    }
    if ('key' in source) {
      const key = source['key']
      if (key) {
        return activeBalances[key]?.ledger || defaultLedger
      }
    }
    return defaultLedger
  }

  // Gets an active balance's payee
  const getPayee = (address: MaybeString): PayeeConfig => {
    if (address) {
      const maybePayee = activeBalances[address]?.payee
      if (maybePayee) {
        return maybePayee
      }
    }
    return defaultPayee
  }

  // Gets an active balance's pool membership
  const getPoolMembership = (address: MaybeString): PoolMembership | null => {
    if (address) {
      const maybePoolMembership = activeBalances[address]?.poolMembership
      if (maybePoolMembership) {
        return maybePoolMembership
      }
    }
    return null
  }

  // Gets an active balance's nominations
  const getNominations = (address: MaybeString): Targets => {
    if (address) {
      const maybeNominations =
        activeBalances[address]?.nominations?.targets || []
      if (maybeNominations) {
        return maybeNominations
      }
    }
    return []
  }

  // Handle new account balance event being reported from `Balances`
  const newAccountBalancesCallback = (e: Event) => {
    if (isCustomEvent(e) && Balances.isValidNewAccountBalanceEvent(e)) {
      const { address, ...newBalances } = e.detail

      // Only update state of active accounts
      if (uniqueAccounts.includes(address)) {
        setStateWithRef(
          { ...activeBalancesRef.current, [address]: newBalances },
          setActiveBalances,
          activeBalancesRef
        )
      }
    }
  }

  // Update account balances states on initial render
  //
  // If `Balances` does not return an account balances record for an account, the balance
  // has not yet synced or the provided account is still `null`. In these cases a
  // `new-account-balance` event will be emitted when the balance is ready to be sycned with the UI
  useEffect(() => {
    // Construct new active balances state
    const newActiveBalances: ActiveBalancesState = {}

    for (const account of uniqueAccounts) {
      // Adds an active balance record if it exists in `Balances`
      if (account) {
        const accountBalances = Balances.getAccountBalances(network, account)
        if (accountBalances) {
          newActiveBalances[account] = accountBalances
        }
      }
    }
    // Commit new active balances to state
    setStateWithRef(newActiveBalances, setActiveBalances, activeBalancesRef)
  }, [JSON.stringify(uniqueAccounts)])

  // Reset state when network changes
  useEffectIgnoreInitial(() => {
    setStateWithRef({}, setActiveBalances, activeBalancesRef)
  }, [network])

  // Listen for new account balance events
  const documentRef = useRef<Document>(document)

  useEventListener(
    'new-account-balance',
    newAccountBalancesCallback,
    documentRef
  )

  return {
    getLedger,
    getPayee,
    getPoolMembership,
    getNominations,
  }
}
