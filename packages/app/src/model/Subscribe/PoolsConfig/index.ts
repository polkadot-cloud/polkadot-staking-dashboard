// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { ApiController } from 'controllers/Api';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { NetworkName } from 'types';
import { stringToBn } from 'library/Utils';
import type { Subscription } from 'rxjs';
import { combineLatest } from 'rxjs';

export class PoolsConfig implements Unsubscribable {
  // The associated network for this instance.
  #network: NetworkName;

  // Active subscription.
  #sub: Subscription;

  constructor(network: NetworkName) {
    this.#network = network;

    // Subscribe immediately.
    this.subscribe();
  }

  subscribe = async (): Promise<void> => {
    try {
      const { pApi } = ApiController.get(this.#network);

      if (pApi && this.#sub === undefined) {
        const sub = combineLatest([
          pApi.query.NominationPools.CounterForPoolMembers.watchValue(),
          pApi.query.NominationPools.CounterForBondedPools.watchValue(),
          pApi.query.NominationPools.CounterForRewardPools.watchValue(),
          pApi.query.NominationPools.LastPoolId.watchValue(),
          pApi.query.NominationPools.MaxPoolMembers.watchValue(),
          pApi.query.NominationPools.MaxPoolMembersPerPool.watchValue(),
          pApi.query.NominationPools.MaxPools.watchValue(),
          pApi.query.NominationPools.MinCreateBond.watchValue(),
          pApi.query.NominationPools.MinJoinBond.watchValue(),
          pApi.query.NominationPools.GlobalMaxCommission.watchValue(),
        ]).subscribe(
          ([
            counterForPoolMembers,
            counterForBondedPools,
            counterForRewardPools,
            lastPoolId,
            maxPoolMembersRaw,
            maxPoolMembersPerPoolRaw,
            maxPoolsRaw,
            minCreateBond,
            minJoinBond,
            globalMaxCommission,
          ]) => {
            // Format globalMaxCommission from a perbill to a percent.
            const globalMaxCommissionAsPercent =
              BigInt(globalMaxCommission) / 1000000n;

            // Format max pool members to be a BigNumber, or null if it's not set.
            const maxPoolMembers = maxPoolMembersRaw
              ? new BigNumber(maxPoolMembersRaw.toString())
              : null;

            // Format max pool members per pool to be a BigNumber, or null if it's not set.
            const maxPoolMembersPerPool = maxPoolMembersPerPoolRaw
              ? new BigNumber(maxPoolMembersPerPoolRaw.toString())
              : null;

            // Format max pools to be a BigNumber, or null if it's not set.
            const maxPools = maxPoolsRaw
              ? new BigNumber(maxPoolsRaw.toString())
              : null;

            const poolsConfig = {
              counterForPoolMembers: stringToBn(
                counterForPoolMembers.toString()
              ),
              counterForBondedPools: stringToBn(
                counterForBondedPools.toString()
              ),
              counterForRewardPools: stringToBn(
                counterForRewardPools.toString()
              ),
              lastPoolId: stringToBn(lastPoolId.toString()),
              maxPoolMembers,
              maxPoolMembersPerPool,
              maxPools,
              minCreateBond: stringToBn(minCreateBond.toString()),
              minJoinBond: stringToBn(minJoinBond.toString()),
              globalMaxCommission: Number(
                globalMaxCommissionAsPercent.toString()
              ),
            };

            document.dispatchEvent(
              new CustomEvent('new-pools-config', {
                detail: { poolsConfig },
              })
            );
          }
        );
        this.#sub = sub;
      }
    } catch (e) {
      // Subscription failed.
    }
  };

  // Unsubscribe from class subscription.
  unsubscribe = (): void => {
    if (typeof this.#sub?.unsubscribe === 'function') {
      this.#sub.unsubscribe();
    }
  };
}
