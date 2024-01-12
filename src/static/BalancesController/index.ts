// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot-cloud/react/types';
import { rmCommas } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import type { Balances, Ledger, UnlockChunkRaw } from 'contexts/Balances/types';
import { APIController } from 'static/APController';
import type { AnyApi } from 'types';

export class BalancesController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Accounts that are being subscribed to.
  static accounts: string[] = [];

  // Account ledgers, populated by api callbacks.
  // TODO: update `Ledger` type to omit `address`.
  static ledgers: Record<string, Ledger> = {};

  // Account balances, populated by api callbacks.
  // TODO: update `Balances` type to omit `address`.
  static balances: Record<string, Balances> = {};

  // Unsubscribe objects.
  static _unsubs: Record<string, VoidFn> = {};

  // ------------------------------------------------------
  // Account syncing.
  // ------------------------------------------------------

  // Subscribes new accounts and unsubscribes & removes removed accounts.
  static syncAccounts = async (newAccounts: string[]): Promise<void> => {
    const { api } = APIController;

    // Handle accounts that have been removed.
    this.handleRemovedAccounts(newAccounts);

    // Determine new accounts that need to be subscribed to.
    const accountsAdded = newAccounts.filter(
      (account) => !this.accounts.includes(account)
    );

    // Subscribe to and add new accounts data.
    accountsAdded.forEach(async (address) => {
      this.accounts.push(address);

      const unsub = await api.queryMulti<AnyApi>(
        [
          [api.query.staking.ledger, address],
          [api.query.system.account, address],
          [api.query.balances.locks, address],
        ],
        async ([ledgerResult, accountResult, locksResult]) => {
          this.handleLedgerCallback(address, ledgerResult);
          this.handleAccountCallback(address, accountResult, locksResult);

          // Send updated account state back to UI.
          document.dispatchEvent(
            new CustomEvent('new-account-balance', {
              detail: {
                ledger: this.ledgers[address],
                balances: this.balances[address],
              },
            })
          );
        }
      );
      this._unsubs[address] = unsub;
    });
  };

  // Remove accounts that no longer exist.
  static handleRemovedAccounts = (newAccounts: string[]) => {
    // Determine removed accounts.
    const accountsRemoved = this.accounts.filter(
      (account) => !newAccounts.includes(account)
    );
    // Unsubscribe from removed account subscriptions.
    accountsRemoved.forEach((account) => {
      this._unsubs[account]();
      delete this._unsubs[account];
    });
    // Remove removed accounts from class.
    this.accounts = this.accounts.filter(
      (account) => !accountsRemoved.includes(account)
    );
  };

  // Handle ledger callback.
  static handleLedgerCallback = (address: string, result: AnyApi): void => {
    const ledger = result.unwrapOr(null);

    // If ledger is null, remove from class data and exit early.
    if (ledger === null) {
      delete this.ledgers[address];
      return;
    }

    const { stash, total, active, unlocking } = ledger;

    // Send stash address to UI as event if not presently imported.
    if (!this.accounts.includes(stash.toString())) {
      document.dispatchEvent(
        new CustomEvent('new-external-account', {
          detail: { stash: stash.toString() },
        })
      );
    }

    this.ledgers[address] = {
      address,
      stash: stash.toString(),
      active: this.balanceToBigNumber(active.toString()),
      total: this.balanceToBigNumber(total.toString()),
      unlocking: unlocking.toHuman().map(({ era, value }: UnlockChunkRaw) => ({
        era: Number(rmCommas(era)),
        value: this.balanceToBigNumber(value).toString(),
      })),
    };
  };

  // Handle account callback.
  static handleAccountCallback = (
    address: string,
    { data: accountData, nonce }: AnyApi,
    locksResult: AnyApi
  ): void => {
    this.balances[address] = {
      address,
      nonce: nonce.toNumber(),
      balance: {
        free: this.balanceToBigNumber(accountData.free.toString()),
        reserved: this.balanceToBigNumber(accountData.reserved.toString()),
        frozen: this.balanceToBigNumber(accountData.frozen.toString()),
      },
      locks: locksResult.toHuman().map((lock: AnyApi) => ({
        ...lock,
        id: lock.id.trim(),
        amount: this.balanceToBigNumber(lock.amount),
      })),
    };
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

  // ------------------------------------------------------
  // Class helpers.
  // ------------------------------------------------------

  // Converts a balance string into a `BigNumber`.
  static balanceToBigNumber = (value: string): BigNumber =>
    new BigNumber(rmCommas(value));
}
