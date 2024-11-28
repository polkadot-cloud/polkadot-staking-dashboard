// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import type {
  Balances as IBalances,
  Ledger,
  Nominations,
} from 'contexts/Balances/types';
import type { PoolMembership } from 'contexts/Pools/types';
import type { PayeeConfig } from 'contexts/Setup/types';
import { Apis } from 'controllers/Apis';
import { Balances } from 'controllers/Balances';
import { defaultNominations } from 'controllers/Balances/defaults';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { PapiApi } from 'model/Api/types';
import type { Subscription } from 'rxjs';
import { combineLatest } from 'rxjs';
import type { AnyApi, NetworkName } from 'types';
import { stringToBn } from 'utils';

export class AccountBalances implements Unsubscribable {
  // The associated network for this instance.
  #network: NetworkName;

  // Active subscription.
  #sub: Subscription;

  // Account to subscribe to.
  #address: string;

  // Account ledger.
  ledger: Ledger | undefined;

  // Account balances.
  balance: IBalances;

  // Payee config.
  payee: PayeeConfig | undefined;

  // Pool membership.
  poolMembership: PoolMembership | undefined;

  // Account nominations.
  nominations: Nominations;

  constructor(network: NetworkName, address: string) {
    this.#network = network;
    this.#address = address;
    this.subscribe();
  }

  subscribe = async (): Promise<void> => {
    try {
      const api = Apis.getApi(this.#network);
      const bestOrFinalized = 'best';

      if (api && this.#sub === undefined) {
        const sub = combineLatest([
          api.query.Staking.Ledger.watchValue(this.#address, bestOrFinalized),
          api.query.System.Account.watchValue(this.#address, bestOrFinalized),
          api.query.Balances.Locks.watchValue(this.#address, bestOrFinalized),
          api.query.Staking.Payee.watchValue(this.#address, bestOrFinalized),
          api.query.NominationPools.PoolMembers.watchValue(
            this.#address,
            bestOrFinalized
          ),
          api.query.NominationPools.ClaimPermissions.watchValue(
            this.#address,
            bestOrFinalized
          ),
          api.query.Staking.Nominators.watchValue(
            this.#address,
            bestOrFinalized
          ),
        ]).subscribe(
          async ([
            ledger,
            account,
            locks,
            payee,
            poolMembers,
            claimPermissions,
            nominators,
          ]) => {
            this.handleLedger(ledger);
            this.handleAccount(account, locks);
            this.handlePayee(payee);

            await this.handlePoolMembership(api, poolMembers, claimPermissions);
            this.handleNominations(nominators);

            // Send updated account state back to UI.
            const accountBalance = {
              address: this.#address,
              ledger: this.ledger,
              balances: this.balance,
              payee: this.payee,
              poolMembership: this.poolMembership,
              nominations: this.nominations,
            };

            document.dispatchEvent(
              new CustomEvent('new-account-balance', { detail: accountBalance })
            );
          }
        );

        this.#sub = sub;
      }
    } catch (e) {
      // Subscription failed.
    }
  };

  // Handle ledger result.
  handleLedger = (ledger: AnyApi): void => {
    // If ledger is null, remove from class.
    if (!ledger) {
      this.ledger = undefined;
    } else {
      const { stash, total, active, unlocking } = ledger;

      // Send stash address to UI as event if not presently imported.
      if (!Balances.accounts.includes(stash.toString())) {
        document.dispatchEvent(
          new CustomEvent('new-external-account', {
            detail: { address: stash.toString() },
          })
        );
      }

      this.ledger = {
        stash: stash.toString(),
        active: stringToBn(active.toString()),
        total: stringToBn(total.toString()),
        unlocking: unlocking.map(
          ({ era, value }: { era: number; value: bigint }) => ({
            era: Number(era),
            value: stringToBn(value.toString()),
          })
        ),
      };
    }
  };

  // Handle account callback.
  handleAccount = (
    { data: accountData, nonce }: AnyApi,
    locksResult: AnyApi
  ): void => {
    this.balance = {
      nonce,
      balance: {
        free: stringToBn(accountData.free.toString()),
        reserved: stringToBn(accountData.reserved.toString()),
        frozen: stringToBn(accountData.frozen.toString()),
      },
      locks: locksResult.map((lock: { id: AnyApi; amount: bigint }) => ({
        id: lock.id.asText().trim(),
        amount: stringToBn(lock.amount.toString()),
      })),
    };
  };

  // Handle payee callback.
  handlePayee = (result: AnyApi): void => {
    if (result === undefined) {
      this.payee = undefined;
    } else {
      this.payee = {
        destination: result.type || null,
        account: result.value || undefined,
      };
    }
  };

  // Handle pool membership and claim commission callback.
  handlePoolMembership = async (
    api: PapiApi,
    poolMembers: AnyApi,
    claimPermissionResult: AnyApi
  ): Promise<void> => {
    // If pool membership is `null`, remove pool membership data from class data and exit early.
    // This skips claim permission data as well as user would not have claim permissions if they are
    // not in a pool.
    if (!poolMembers) {
      this.poolMembership = undefined;
      return;
    }

    const unlocking = poolMembers?.unbonding_eras.map(([e, v]: AnyApi) => ({
      era: e,
      value: new BigNumber((v as bigint).toString()),
    }));

    const apiResult = await api.apis.NominationPoolsApi.points_to_balance(
      poolMembers.pool_id,
      poolMembers.points,
      { at: 'best' }
    );
    const balance = new BigNumber(apiResult?.toString() || 0);
    const claimPermission = claimPermissionResult?.type || 'Permissioned';

    this.poolMembership = {
      address: this.#address,
      poolId: poolMembers.pool_id,
      points: poolMembers.points.toString(),
      balance,
      lastRecordedRewardCounter:
        poolMembers.last_recorded_reward_counter.toString(),
      unbondingEras: unlocking, // NOTE: This is a duplicate of `unlocking`.
      claimPermission,
      unlocking,
    };
  };

  // Handle nominations callback.
  handleNominations = (nominators: AnyApi): void => {
    this.nominations = !nominators
      ? defaultNominations
      : {
          targets: nominators.targets,
          submittedIn: nominators.submitted_in,
        };
  };

  // Unsubscribe from class subscription.
  unsubscribe = (): void => {
    if (typeof this.#sub?.unsubscribe === 'function') {
      this.#sub.unsubscribe();
    }
  };
}
