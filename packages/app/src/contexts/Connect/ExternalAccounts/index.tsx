// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import type { AccountAddedBy, ExternalAccount } from '@w3ux/types'
import { ellipsisFn, formatAccountSs58 } from '@w3ux/utils'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { type ReactNode } from 'react'
import type {
  AddExternalAccountResult,
  ExternalAccountImportType,
  ExternalAccountsContextInterface,
} from './types'
import {
  addLocalExternalAccount,
  externalAccountExistsLocal,
  removeLocalExternalAccounts,
} from './Utils'

export const [ExternalAccountsContext, useExternalAccounts] =
  createSafeContext<ExternalAccountsContextInterface>()

export const ExternalAccountsProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const {
    network,
    networkData: { ss58 },
  } = useNetwork()
  const { activeAccount, setActiveAccount } = useActiveAccounts()

  // Adds an external account (non-wallet) to accounts
  const addExternalAccount = (
    address: string,
    addedBy: AccountAddedBy
  ): AddExternalAccountResult | null => {
    const formattedAddress = formatAccountSs58(address, ss58)

    // Address should be valid, but if not, return null early
    if (!formattedAddress) {
      return null
    }

    let newEntry = {
      address: formattedAddress,
      network,
      name: ellipsisFn(address),
      source: 'external',
      addedBy,
    }

    const existsLocal = externalAccountExistsLocal(newEntry.address, network)

    // Whether the account needs to remain imported as a system account
    const toSystem =
      existsLocal && addedBy === 'system' && existsLocal.addedBy !== 'system'

    let isImported = true
    let importType: ExternalAccountImportType = 'new'

    if (!existsLocal) {
      // Only add `user` accounts to localStorage
      if (addedBy === 'user') {
        addLocalExternalAccount(newEntry)
      }
    } else if (toSystem) {
      // If account is being added by `system`, but is already imported, update it to be a system
      // account. `system` accounts are not persisted to local storage
      //
      // update the entry to a system account
      newEntry = { ...newEntry, addedBy: 'system' }
      importType = 'replace'
    } else {
      isImported = false
    }

    return isImported
      ? {
          type: importType,
          account: newEntry,
        }
      : null
  }

  // Get any external accounts and remove from localStorage
  const forgetExternalAccounts = (forget: ExternalAccount[]) => {
    if (!forget.length) {
      return
    }
    removeLocalExternalAccounts(
      network,
      forget.filter((i) => 'network' in i) as ExternalAccount[]
    )

    // If the currently active account is being forgotten, disconnect
    if (forget.find((a) => a.address === activeAccount) !== undefined) {
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
