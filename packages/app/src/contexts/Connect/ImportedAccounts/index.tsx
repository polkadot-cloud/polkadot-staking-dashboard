// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import { useExtensionAccounts } from '@w3ux/react-connect-kit'
import { ManualSigners } from 'consts'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import type { ReactNode } from 'react'
import { useCallback } from 'react'
import type { ExternalAccount, ImportedAccount, MaybeAddress } from 'types'
import { useOtherAccounts } from '../OtherAccounts'
import { getActiveAccountLocal } from '../Utils'
import type { ImportedAccountsContextInterface } from './types'

export const [ImportedAccountsContext, useImportedAccounts] =
  createSafeContext<ImportedAccountsContextInterface>()

export const ImportedAccountsProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const { network } = useNetwork()
  const { otherAccounts } = useOtherAccounts()
  const { setActiveAccount } = useActiveAccounts()
  const { getExtensionAccounts } = useExtensionAccounts()

  const { ss58 } = getStakingChainData(network)
  // Get the imported extension accounts formatted with the current network's ss58 prefix
  const extensionAccounts = getExtensionAccounts(ss58)
  const allAccounts = extensionAccounts.concat(otherAccounts)

  // Stringify account addresses and account names to determine if they have changed. Ignore other properties including `signer` and `source`
  const shallowAccountStringify = (accounts: ImportedAccount[]) => {
    const sorted = accounts.sort((a, b) => {
      if (a.address < b.address) {
        return -1
      }
      if (a.address > b.address) {
        return 1
      }
      return 0
    })
    return JSON.stringify(
      sorted.map((account) => [account.address, account.source, account.name])
    )
  }

  const stringifiedAccountsKey = shallowAccountStringify(allAccounts)

  // Gets an account from `allAccounts`
  //
  // Caches the function when imported accounts update
  const getAccount = useCallback(
    (who: MaybeAddress) =>
      allAccounts.find(({ address }) => address === who) || null,
    [stringifiedAccountsKey]
  )

  // Checks if an address is a read-only account
  //
  // Caches the function when imported accounts update
  const isReadOnlyAccount = useCallback(
    (who: MaybeAddress) => {
      const account = allAccounts.find(({ address }) => address === who) || {}
      if (Object.prototype.hasOwnProperty.call(account, 'addedBy')) {
        const { addedBy } = account as ExternalAccount
        return addedBy === 'user'
      }
      return false
    },
    [stringifiedAccountsKey]
  )

  // Checks whether an account can sign transactions
  //
  // Caches the function when imported accounts update
  const accountHasSigner = useCallback(
    (address: MaybeAddress) =>
      allAccounts.find(
        (account) =>
          account.address === address && account.source !== 'external'
      ) !== undefined,
    [stringifiedAccountsKey]
  )

  // Checks whether an account needs manual signing
  //
  // This is the case for accounts imported from hardware wallets, transactions of which cannot be
  // automatically signed by a provided `signer` as is the case with web extensions
  //
  // Caches the function when imported accounts update
  const requiresManualSign = useCallback(
    (address: MaybeAddress) =>
      allAccounts.find(
        (a) => a.address === address && ManualSigners.includes(a.source)
      ) !== undefined,
    [stringifiedAccountsKey]
  )

  // Re-sync the active account on network change
  useEffectIgnoreInitial(() => {
    const localActiveAccount = getActiveAccountLocal(network, ss58)
    if (getAccount(localActiveAccount?.address || null) !== null) {
      setActiveAccount(localActiveAccount, false)
    } else {
      setActiveAccount(null, false)
    }
  }, [network, stringifiedAccountsKey])

  return (
    <ImportedAccountsContext.Provider
      value={{
        accounts: allAccounts,
        getAccount,
        isReadOnlyAccount,
        accountHasSigner,
        requiresManualSign,
        stringifiedAccountsKey,
      }}
    >
      {children}
    </ImportedAccountsContext.Provider>
  )
}
