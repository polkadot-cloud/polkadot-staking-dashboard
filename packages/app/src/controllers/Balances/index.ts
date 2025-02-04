// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AccountBalances } from 'api/subscribe/accountBalances'
import type { NetworkId } from 'common-types'
import type { ActiveBalance } from 'contexts/Balances/types'
import { Subscriptions } from 'controllers/Subscriptions'
import { Syncs } from 'controllers/Syncs'

export class Balances {
  // Accounts that are being subscribed to.
  static accounts: string[] = []

  // Subscribes new accounts and unsubscribes & removes removed accounts
  static syncAccounts = async (
    network: NetworkId,
    newAccounts: string[]
  ): Promise<void> => {
    // Handle accounts that have been removed
    this.handleRemovedAccounts(network, newAccounts)

    // Determine new accounts that need to be subscribed to
    const accountsAdded = newAccounts.filter(
      (account) => !this.accounts.includes(account)
    )

    // Exit early if there are no new accounts to subscribe to
    if (!accountsAdded.length) {
      return
    }

    // Strart syncing if new accounts added
    Syncs.dispatch('balances', 'syncing')

    // Subscribe to and add new accounts data
    accountsAdded.forEach(async (address) => {
      this.accounts.push(address)

      Subscriptions.set(
        network,
        `accountBalances-${address}`,
        new AccountBalances(network, address)
      )
    })
  }

  // Remove accounts that no longer exist
  static handleRemovedAccounts = (
    network: NetworkId,
    newAccounts: string[]
  ): void => {
    // Determine removed accounts
    const accountsRemoved = this.accounts.filter(
      (account) => !newAccounts.includes(account)
    )
    // Unsubscribe from removed account subscriptions
    accountsRemoved.forEach((account) => {
      Subscriptions.remove(network, `accountBalances-${account}`)
    })

    // Remove removed accounts from class
    this.accounts = this.accounts.filter(
      (account) => !accountsRemoved.includes(account)
    )
  }

  // Gets an `AccountBalances` subscription from class members for the given address if it exists
  static getAccountBalances = (
    network: NetworkId,
    address: string
  ): ActiveBalance | undefined => {
    const accountBalances = Subscriptions.get(
      network,
      `accountBalances-${address}`
    ) as AccountBalances

    // Account info has not synced yet - exit early
    if (!accountBalances) {
      return undefined
    }
    const ledger = accountBalances.ledger
    const balances = accountBalances.balance
    const payee = accountBalances.payee
    const poolMembership = accountBalances.poolMembership
    const nominations = accountBalances.nominations

    return {
      ledger,
      balances,
      payee,
      poolMembership,
      nominations,
    }
  }

  // Checks if event detailis a valid `new-account-balance` event. Note that `ledger` may not exist
  // and therefore cannot be tested
  static isValidNewAccountBalanceEvent = (
    event: CustomEvent
  ): event is CustomEvent<ActiveBalance & { address: string }> =>
    event.detail && event.detail.address && event.detail.balances
}
