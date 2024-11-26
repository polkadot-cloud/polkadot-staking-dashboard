// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ActiveBalance } from 'contexts/Balances/types';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { SyncController } from 'controllers/Sync';
import { AccountBalances } from 'model/Subscribe/AccountBalances';
import type { NetworkName } from 'types';

export class BalancesController {
  // Accounts that are being subscribed to.
  static accounts: string[] = [];

  // Subscribes new accounts and unsubscribes & removes removed accounts.
  static syncAccounts = async (
    network: NetworkName,
    newAccounts: string[]
  ): Promise<void> => {
    // Handle accounts that have been removed.
    this.handleRemovedAccounts(network, newAccounts);

    // Determine new accounts that need to be subscribed to.
    const accountsAdded = newAccounts.filter(
      (account) => !this.accounts.includes(account)
    );

    // Exit early if there are no new accounts to subscribe to.
    if (!accountsAdded.length) {
      return;
    }

    // Strart syncing if new accounts added.
    SyncController.dispatch('balances', 'syncing');

    // Subscribe to and add new accounts data.
    accountsAdded.forEach(async (address) => {
      this.accounts.push(address);

      SubscriptionsController.set(
        network,
        `accountBalances-${address}`,
        new AccountBalances(network, address)
      );
    });
  };

  // Remove accounts that no longer exist.
  static handleRemovedAccounts = (
    network: NetworkName,
    newAccounts: string[]
  ): void => {
    // Determine removed accounts.
    const accountsRemoved = this.accounts.filter(
      (account) => !newAccounts.includes(account)
    );
    // Unsubscribe from removed account subscriptions.
    accountsRemoved.forEach((account) => {
      SubscriptionsController.remove(network, `accountBalances-${account}`);
    });

    // Remove removed accounts from class.
    this.accounts = this.accounts.filter(
      (account) => !accountsRemoved.includes(account)
    );
  };

  // Gets an `AccountBalances` subscription from class members for the given address if it exists.
  static getAccountBalances = (
    network: NetworkName,
    address: string
  ): ActiveBalance | undefined => {
    const accountBalances = SubscriptionsController.get(
      network,
      `accountBalances-${address}`
    ) as AccountBalances;

    // Account info has not synced yet - exit early.
    if (!accountBalances) {
      return undefined;
    }
    const ledger = accountBalances.ledger;
    const balances = accountBalances.balance;
    const payee = accountBalances.payee;
    const poolMembership = accountBalances.poolMembership;
    const nominations = accountBalances.nominations;

    return {
      ledger,
      balances,
      payee,
      poolMembership,
      nominations,
    };
  };

  // Checks if event detailis a valid `new-account-balance` event. Note that `ledger` may not exist
  // and therefore cannot be tested.
  static isValidNewAccountBalanceEvent = (
    event: CustomEvent
  ): event is CustomEvent<ActiveBalance & { address: string }> =>
    event.detail && event.detail.address && event.detail.balances;
}
