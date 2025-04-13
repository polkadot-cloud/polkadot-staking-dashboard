// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { ellipsisFn, formatAccountSs58 } from '@w3ux/utils'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import {
  addExternalAccount as addExternalAccountBus,
  externalAccountExists,
  removeExternalAccounts,
} from 'global-bus'
import { type ReactNode } from 'react'
import type { AccountAddedBy, ExternalAccount } from 'types'
import type {
  AddExternalAccountResult,
  ExternalAccountImportType,
  ExternalAccountsContextInterface,
} from './types'

export const [ExternalAccountsContext, useExternalAccounts] =
  createSafeContext<ExternalAccountsContextInterface>()

export const ExternalAccountsProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const { network } = useNetwork()
  const { activeAddress, setActiveAccount } = useActiveAccounts()
  const { ss58 } = getNetworkData(network)

  // Adds an external account to imported accounts
  const addExternalAccount = (
    address: string,
    addedBy: AccountAddedBy
  ): AddExternalAccountResult | null => {
    const formatted = formatAccountSs58(address, ss58)
    if (!formatted) {
      return null
    }

    let newEntry = {
      address: formatted,
      network,
      name: ellipsisFn(address),
      source: 'external',
      addedBy,
    }

    const exists = externalAccountExists(network, newEntry.address)

    // Whether the account needs to be imported as a system account
    const toSystem =
      exists && addedBy === 'system' && exists.addedBy !== 'system'

    let importType: ExternalAccountImportType = 'new'

    if (toSystem) {
      // If account is being added by `system`, but is already imported, update it to be a system
      // account. `system` accounts are not persisted to local storage
      //
      // update the entry to a system account
      newEntry = { ...newEntry, addedBy: 'system' }
      importType = 'replace'
    }

    // Add account to global bus
    addExternalAccountBus(network, newEntry, newEntry.addedBy === 'system')

    return {
      type: importType,
      account: newEntry,
    }
  }

  // Get any external accounts and remove from localStorage
  const forgetExternalAccounts = (forget: ExternalAccount[]) => {
    if (!forget.length) {
      return
    }
    const toRemove = forget.filter((i) => 'network' in i) as ExternalAccount[]
    removeExternalAccounts(network, toRemove)

    // If the currently active account is being forgotten, disconnect
    if (forget.find((a) => a.address === activeAddress) !== undefined) {
      setActiveAccount(null)
    }
  }

  return (
    <ExternalAccountsContext.Provider
      value={{ addExternalAccount, forgetExternalAccounts }}
    >
      {children}
    </ExternalAccountsContext.Provider>
  )
}
