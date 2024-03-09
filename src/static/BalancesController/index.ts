// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { rmCommas } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { APIController } from 'static/APIController';
import type { AnyApi, MaybeAddress, VoidFn } from 'types';
import type {
  ActiveBalance,
  Balances,
  Ledger,
  Nominations,
  UnlockChunkRaw,
} from 'contexts/Balances/types';
import type { PayeeConfig, PayeeOptions } from 'contexts/Setup/types';
import type { PoolMembership } from 'contexts/Pools/types';
import { SyncController } from 'static/SyncController';
import { defaultNominations } from './defaults';

export class BalancesController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Accounts that are being subscribed to.
  static accounts: string[] = [];

  // Account ledgers, populated by api callbacks.
  static ledgers: Record<string, Ledger> = {};

  // Account balances, populated by api callbacks.
  static balances: Record<string, Balances> = {};

  // Account payees, populated by api callbacks.
  static payees: Record<string, PayeeConfig> = {};

  // Account pool membership and claim commissions, populated by api callbacks.
  static poolMemberships: Record<string, PoolMembership> = {};

  // Account nominations, populated by api callbacks.
  static nominations: Record<string, Nominations> = {};

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

    // Exit early if there are no new accounts to subscribe to.
    if (!accountsAdded.length) {
      return;
    }

    // Strart syncing if new accounts added.
    SyncController.dispatch('balances', 'syncing');

    // Subscribe to and add new accounts data.
    accountsAdded.forEach(async (address) => {
      this.accounts.push(address);
      const unsub = await api.queryMulti(
        [
          [api.query.staking.ledger, address],
          [api.query.system.account, address],
          [api.query.balances.locks, address],
          [api.query.staking.payee, address],
          [api.query.nominationPools.poolMembers, address],
          [api.query.nominationPools.claimPermissions, address],
          [api.query.staking.nominators, address],
        ],
        async ([
          ledgerResult,
          accountResult,
          locksResult,
          payeeResult,
          poolMembersResult,
          claimPermissionsResult,
          nominatorsResult,
        ]): Promise<void> => {
          this.handleLedgerCallback(address, ledgerResult);
          this.handleAccountCallback(address, accountResult, locksResult);
          this.handlePayeeCallback(address, payeeResult);

          // NOTE: async: contains runtime call for pending rewards.
          await this.handlePoolMembershipCallback(
            address,
            poolMembersResult,
            claimPermissionsResult
          );

          this.handleNominations(address, nominatorsResult);

          // Send updated account state back to UI.
          document.dispatchEvent(
            new CustomEvent('new-account-balance', {
              detail: {
                address,
                ledger: this.ledgers[address],
                balances: this.balances[address],
                payee: this.payees[address],
                poolMembership: this.poolMemberships[address],
                nominations: this.nominations[address],
              },
            })
          );
        }
      );
      this._unsubs[address] = unsub;
    });
  };

  // Remove accounts that no longer exist.
  static handleRemovedAccounts = (newAccounts: string[]): void => {
    // Determine removed accounts.
    const accountsRemoved = this.accounts.filter(
      (account) => !newAccounts.includes(account)
    );
    // Unsubscribe from removed account subscriptions.
    accountsRemoved.forEach((account) => {
      if (this._unsubs?.[account]) {
        this._unsubs[account]();
      }
      delete this._unsubs[account];
      delete this.ledgers[account];
      delete this.balances[account];
      delete this.payees[account];
      delete this.poolMemberships[account];
      delete this.nominations[account];
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
          detail: { address: stash.toString() },
        })
      );
    }

    this.ledgers[address] = {
      stash: stash.toString(),
      active: this.stringToBigNumber(active.toString()),
      total: this.stringToBigNumber(total.toString()),
      unlocking: unlocking.toHuman().map(({ era, value }: UnlockChunkRaw) => ({
        era: Number(rmCommas(era)),
        value: this.stringToBigNumber(value),
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
      nonce: nonce.toNumber(),
      balance: {
        free: this.stringToBigNumber(accountData.free.toString()),
        reserved: this.stringToBigNumber(accountData.reserved.toString()),
        frozen: this.stringToBigNumber(accountData.frozen.toString()),
      },
      locks: locksResult
        .toHuman()
        .map((lock: { id: string; amount: string }) => ({
          ...lock,
          id: lock.id.trim(),
          amount: this.stringToBigNumber(lock.amount),
        })),
    };
  };

  // Handle payee callback. payee with `Account` type is returned as an key value pair, with all
  // others strings. This function handles both cases and formats into a unified structure.
  static handlePayeeCallback = (address: string, result: AnyApi): void => {
    const payeeHuman = result.toHuman();
    let payeeFinal: PayeeConfig;

    if (payeeHuman !== null) {
      if (typeof payeeHuman === 'string') {
        const destination = payeeHuman as PayeeOptions;
        payeeFinal = {
          destination,
          account: null,
        };
      } else {
        const payeeEntry = Object.entries(payeeHuman);
        const destination = `${payeeEntry[0][0]}` as PayeeOptions;
        const account = `${payeeEntry[0][1]}` as MaybeAddress;
        payeeFinal = {
          destination,
          account,
        };
      }
      this.payees[address] = payeeFinal;
    }
  };

  // Handle pool membership and claim commission callback.
  static handlePoolMembershipCallback = async (
    address: string,
    poolMembersResult: AnyApi,
    claimPermissionsResult: AnyApi
  ): Promise<void> => {
    // If pool membership is `null`, remove pool membership data from class data and exit early.
    // This skips claim permission data as well as user would not have claim permissions if they are
    // not in a pool.
    const membership = poolMembersResult?.unwrapOr(undefined)?.toHuman();
    if (!membership) {
      delete this.poolMemberships[address];
      return;
    }

    // Format pool membership data.
    const unlocking = Object.entries(membership?.unbondingEras || {}).map(
      ([e, v]) => ({
        era: Number(rmCommas(e as string)),
        value: new BigNumber(rmCommas(v as string)),
      })
    );
    membership.points = rmCommas(membership?.points || '0');
    const balance = new BigNumber(
      (
        await APIController.api.call.nominationPoolsApi.pointsToBalance(
          membership.poolId,
          membership.points
        )
      )?.toString() || '0'
    );
    const claimPermission =
      claimPermissionsResult?.toString() || 'Permissioned';

    // Persist formatted pool membership data to class.
    this.poolMemberships[address] = {
      ...membership,
      address,
      balance,
      claimPermission,
      unlocking,
    };
  };

  // Handle nominations callback.
  static handleNominations = (
    address: string,
    nominatorsResult: AnyApi
  ): void => {
    const nominators = nominatorsResult.unwrapOr(null);

    this.nominations[address] =
      nominators === null
        ? defaultNominations
        : {
            targets: nominators.targets.toHuman(),
            submittedIn: nominators.submittedIn.toHuman(),
          };
  };

  // Gets an `ActiveBalance` from class members for the given address if it exists.
  static getAccountBalances = (address: string): ActiveBalance | undefined => {
    const ledger = this.ledgers[address];
    const balances = this.balances[address];
    const payee = this.payees[address];
    const poolMembership = this.poolMemberships[address];
    const nominations = this.nominations[address];

    if (balances === undefined) {
      // Account info has not synced yet. Note that `ledger` may not exist and therefore cannot be
      // tested.
      return undefined;
    }
    return {
      ledger,
      balances,
      payee,
      poolMembership,
      nominations,
    };
  };

  // ------------------------------------------------------
  // Subscription handling.
  // ------------------------------------------------------

  // Unsubscribe from all subscriptions and reset class members.
  static unsubscribe = (): void => {
    Object.values(this._unsubs).forEach((unsub) => {
      unsub();
    });
    this._unsubs = {};
  };

  // Reset all saved state.
  static resetState = (): void => {
    this.accounts = [];
    this.ledgers = {};
    this.balances = {};
    this.payees = {};
    this.poolMemberships = {};
    this.nominations = {};
  };

  // ------------------------------------------------------
  // Class helpers.
  // ------------------------------------------------------

  // Converts a balance string into a `BigNumber`.
  static stringToBigNumber = (value: string): BigNumber =>
    new BigNumber(rmCommas(value));

  // Checks if event detailis a valid `new-account-balance` event. Note that `ledger` may not exist
  // and therefore cannot be tested.
  static isValidNewAccountBalanceEvent = (
    event: CustomEvent
  ): event is CustomEvent<ActiveBalance & { address: string }> =>
    event.detail && event.detail.address && event.detail.balances;
}
