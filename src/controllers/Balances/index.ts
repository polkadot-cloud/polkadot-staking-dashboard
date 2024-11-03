// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkName } from 'types';
import type { ActiveBalance } from 'contexts/Balances/types';
import { SyncController } from 'controllers/Sync';
import { Balance } from 'model/Subscribe/Balance';
import { SubscriptionsController } from 'controllers/Subscriptions';

export class BalancesController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Accounts that are being subscribed to.
  static accounts: string[] = [];

  // ------------------------------------------------------
  // Account syncing.
  // ------------------------------------------------------

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

      // Initialise balance subscription.
      SubscriptionsController.set(
        network,
        `balances-${address}`,
        new Balance(network, address)
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
      SubscriptionsController.remove(network, `balances-${account}`);
    });

    // Remove removed accounts from class.
    this.accounts = this.accounts.filter(
      (account) => !accountsRemoved.includes(account)
    );
  };

  // Gets an `ActiveBalance` from class members for the given address if it exists.
  static getAccountBalances = (
    network: NetworkName,
    address: string
  ): ActiveBalance | undefined => {
    const subscription = SubscriptionsController.get(
      network,
      `balances-${address}`
    ) as Balance;

    if (subscription === undefined) {
      // Account info has not synced yet.
      return undefined;
    }

    const ledger = subscription.ledger;
    const balances = subscription.balances;
    const payee = subscription.payee;
    const poolMembership = subscription.poolMembership;
    const nominations = subscription.nominations;

    return {
      ledger,
      balances,
      payee,
      poolMembership,
      nominations,
    };
  };

  // Checks if all account balance subscriptions have initialised.
  static areAccountsSynced = (network: NetworkName): boolean =>
    this.accounts.every((address) => {
      const subscription = SubscriptionsController.get(
        network,
        `balances-${address}`
      ) as Balance;
      return subscription.balances !== undefined;
    });

  // ------------------------------------------------------
  // Class helpers.
  // ------------------------------------------------------

  // Checks if event detailis a valid `new-account-balance` event. Note that `ledger` may not exist
  // and therefore cannot be tested.
  static isValidNewAccountBalanceEvent = (
    event: CustomEvent
  ): event is CustomEvent<ActiveBalance & { address: string }> =>
    event.detail && event.detail.address && event.detail.balances;
}
