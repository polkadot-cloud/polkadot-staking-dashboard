// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks'
import {
  addedTo,
  matchedProperties,
  removedFrom,
  setStateWithRef,
} from '@w3ux/utils'
import { Bonded } from 'api/subscribe/bonded'
import { useApi } from 'contexts/Api'
import { useExternalAccounts } from 'contexts/Connect/ExternalAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts'
import { useNetwork } from 'contexts/Network'
import { Subscriptions } from 'controllers/Subscriptions'
import { isCustomEvent } from 'controllers/utils'
import type { ReactNode } from 'react'
import { createContext, useContext, useRef, useState } from 'react'
import type { MaybeAddress } from 'types'
import { useEventListener } from 'usehooks-ts'
import * as defaults from './defaults'
import type { BondedAccount, BondedContextInterface } from './types'

export const BondedContext = createContext<BondedContextInterface>(
  defaults.defaultBondedContext
)

export const useBonded = () => useContext(BondedContext)

export const BondedProvider = ({ children }: { children: ReactNode }) => {
  const { isReady } = useApi()
  const { network } = useNetwork()
  const { accounts } = useImportedAccounts()
  const { addExternalAccount } = useExternalAccounts()
  const { addOrReplaceOtherAccount } = useOtherAccounts()

  // Bonded accounts state
  const [bondedAccounts, setBondedAccounts] = useState<BondedAccount[]>([])
  const bondedAccountsRef = useRef(bondedAccounts)

  // Handle the syncing of accounts on accounts change
  const handleSyncAccounts = () => {
    // Sync removed accounts
    const handleRemovedAccounts = () => {
      const removed = removedFrom(accounts, bondedAccountsRef.current, [
        'address',
      ]).map(({ address }) => address)

      removed?.forEach((address) => {
        Subscriptions.remove(network, `bonded-${address}`)
      })
    }
    // Sync added accounts
    const handleAddedAccounts = () => {
      const added = addedTo(accounts, bondedAccountsRef.current, ['address'])

      if (added.length) {
        added.forEach(({ address }) =>
          Subscriptions.set(
            network,
            `bonded-${address}`,
            new Bonded(network, address)
          )
        )
      }
    }

    // Sync existing accounts
    const handleExistingAccounts = () => {
      setStateWithRef(
        matchedProperties(accounts, bondedAccountsRef.current, ['address']),
        setBondedAccounts,
        bondedAccountsRef
      )
    }

    handleRemovedAccounts()
    handleAddedAccounts()
    handleExistingAccounts()
  }

  const getBondedAccount = (address: MaybeAddress) =>
    bondedAccountsRef.current.find((a) => a.address === address)?.bonded || null

  // Handle `polkadot-api` events
  const handleNewBondedAccount = (e: Event) => {
    if (isCustomEvent(e)) {
      const { account } = e.detail
      const { bonded, address } = account

      // Add bonded (controller) account as external account if not presently imported
      if (bonded) {
        if (accounts.find((s) => s.address === bonded) === undefined) {
          const result = addExternalAccount(bonded, 'system')
          if (result) {
            addOrReplaceOtherAccount(result.account, result.type)
          }
        }
      }

      // Remove stale account if it's already in list
      const newBonded = Object.values(bondedAccountsRef.current)
        .filter((a) => a.address !== address)
        .concat(account)

      // Update bonded accounts state
      setStateWithRef(newBonded, setBondedAccounts, bondedAccountsRef)
    }
  }

  // Handle accounts sync on connected accounts change
  useEffectIgnoreInitial(() => {
    if (isReady) {
      handleSyncAccounts()
    }
  }, [accounts, network, isReady])

  // Handle new bonded account events
  useEventListener(
    'new-bonded-account',
    handleNewBondedAccount,
    useRef<Document>(document)
  )

  return (
    <BondedContext.Provider
      value={{
        getBondedAccount,
        bondedAccounts,
      }}
    >
      {children}
    </BondedContext.Provider>
  )
}
