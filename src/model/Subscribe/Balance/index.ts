// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import { ApiController } from 'controllers/Api';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { Balances, Ledger, Nominations, UnlockChunkRaw } from './types';
import type { AnyApi, MaybeAddress, NetworkName } from 'types';
import type { PayeeConfig, PayeeOptions } from 'contexts/Setup/types';
import type { PoolMembership } from 'contexts/Pools/types';
import { BalancesController } from 'controllers/Balances';
import { stringToBn } from 'library/Utils';
import { rmCommas } from '@w3ux/utils';
import type { ApiPromise } from '@polkadot/api';
import BigNumber from 'bignumber.js';
import { defaultNominations } from 'controllers/Balances/defaults';

export class Balance implements Unsubscribable {
  // The associated network for this instance.
  #network: NetworkName;

  // The associated address for this subscription.
  #address: string;

  // Account ledger.
  ledger: Ledger | null;

  // Account balances.
  balances: Balances;

  // Account payees.
  payee: PayeeConfig;

  // Account pool membership and claim commissions.
  poolMembership: PoolMembership | null;

  // Account nominations.
  nominations: Nominations;

  // Unsubscribe object.
  #unsub: VoidFn;

  constructor(network: NetworkName, address: string) {
    this.#network = network;
    this.#address = address;
    this.subscribe();
  }

  subscribe = async (): Promise<void> => {
    try {
      const { api } = ApiController.get(this.#network);

      if (api && this.#unsub === undefined) {
        const unsub = await api.queryMulti(
          [
            [api.query.staking.ledger, this.#address],
            [api.query.system.account, this.#address],
            [api.query.balances.locks, this.#address],
            [api.query.staking.payee, this.#address],
            [api.query.nominationPools.poolMembers, this.#address],
            [api.query.nominationPools.claimPermissions, this.#address],
            [api.query.staking.nominators, this.#address],
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
            this.handleLedgerCallback(ledgerResult);
            this.handleAccountCallback(accountResult, locksResult);
            this.handlePayeeCallback(payeeResult);

            // NOTE: async: contains runtime call for pending rewards.
            await this.handlePoolMembershipCallback(
              api,
              poolMembersResult,
              claimPermissionsResult
            );

            this.handleNominations(nominatorsResult);

            // Send updated account state back to UI.
            document.dispatchEvent(
              new CustomEvent('new-account-balance', {
                detail: {
                  address: this.#address,
                  ledger: this.ledger,
                  balances: this.balances,
                  payee: this.payee,
                  poolMembership: this.poolMembership,
                  nominations: this.nominations,
                },
              })
            );
          }
        );

        // Subscription now initialised. Store unsub.
        this.#unsub = unsub as unknown as VoidFn;
      }
    } catch (e) {
      // Silently fail.
    }
  };

  // Handle ledger callback.
  handleLedgerCallback = (result: AnyApi): void => {
    const ledger = result.unwrapOr(null);

    // If ledger is null, remove from class data and exit early.
    if (ledger === null) {
      this.ledger = null;
      return;
    }

    const { stash, total, active, unlocking } = ledger;

    // Send stash address to UI as event if not presently imported.
    if (!BalancesController.accounts.includes(stash.toString())) {
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
      unlocking: unlocking.toHuman().map(({ era, value }: UnlockChunkRaw) => ({
        era: Number(rmCommas(era)),
        value: stringToBn(value),
      })),
    };
  };

  // Handle account callback.
  handleAccountCallback = (
    { data: accountData, nonce }: AnyApi,
    locksResult: AnyApi
  ): void => {
    this.balances = {
      nonce: nonce.toNumber(),
      balance: {
        free: stringToBn(accountData.free.toString()),
        reserved: stringToBn(accountData.reserved.toString()),
        frozen: stringToBn(accountData.frozen.toString()),
      },
      locks: locksResult
        .toHuman()
        .map((lock: { id: string; amount: string }) => ({
          ...lock,
          id: lock.id.trim(),
          amount: stringToBn(lock.amount),
        })),
    };
  };

  // Handle payee callback. payee with `Account` type is returned as an key value pair, with all
  // others strings. This function handles both cases and formats into a unified structure.
  handlePayeeCallback = (result: AnyApi): void => {
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
      this.payee = payeeFinal;
    }
  };

  // Handle pool membership and claim commission callback.
  handlePoolMembershipCallback = async (
    api: ApiPromise,
    poolMembersResult: AnyApi,
    claimPermissionsResult: AnyApi
  ): Promise<void> => {
    // If pool membership is `null`, remove pool membership data from class data and exit early.
    // This skips claim permission data as well as user would not have claim permissions if they are
    // not in a pool.
    const membership = poolMembersResult?.unwrapOr(undefined)?.toHuman();
    if (!membership) {
      this.poolMembership = null;
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
        await api.call.nominationPoolsApi.pointsToBalance(
          membership.poolId,
          membership.points
        )
      )?.toString() || '0'
    );
    const claimPermission =
      claimPermissionsResult?.toString() || 'Permissioned';

    // Persist formatted pool membership data to class.
    this.poolMembership = {
      ...membership,
      address: this.#address,
      balance,
      claimPermission,
      unlocking,
    };
  };

  // Handle nominations callback.
  handleNominations = (nominatorsResult: AnyApi): void => {
    const nominators = nominatorsResult.unwrapOr(null);

    this.nominations =
      nominators === null
        ? defaultNominations
        : {
            targets: nominators.targets.toHuman(),
            submittedIn: nominators.submittedIn.toHuman(),
          };
  };

  // Unsubscribe from class subscription.
  unsubscribe = (): void => {
    if (typeof this.#unsub === 'function') {
      this.#unsub();
    }
  };
}
