// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot-cloud/react/types';

export class BalancesController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Accounts that are being subscribed to.
  static accounts: string[] = [];

  // Unsubscribe objects.
  static _unsubs: Record<string, VoidFn> = {};

  // ------------------------------------------------------
  // Account syncing.
  // ------------------------------------------------------

  // Subscribes new accounts and unsubscribes & removes removed accounts.
  static syncAccounts = async (newAccounts: string[]): Promise<void> => {
    console.log('syncing ', newAccounts.length, ' accounts');
  };

  // ------------------------------------------------------
  // Subscription handling.
  // ------------------------------------------------------

  // Unsubscribe from all subscriptions.
  static unsubscribe = (): void => {
    Object.values(this._unsubs).forEach((unsub) => {
      unsub();
    });
    this._unsubs = {};
    this.accounts = [];
  };
}
