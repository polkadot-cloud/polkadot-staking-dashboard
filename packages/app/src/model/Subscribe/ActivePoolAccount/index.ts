// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Nominations } from 'contexts/Balances/types';
import { defaultPoolNominations } from 'contexts/Pools/ActivePool/defaults';
import type { ActivePool, PoolRoles } from 'contexts/Pools/ActivePool/types';
import type { ActivePoolItem } from 'controllers/ActivePools/types';
import { ApiController } from 'controllers/Api';
import { IdentitiesController } from 'controllers/Identities';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { PapiApi } from 'model/Api/types';
import { combineLatest, type Subscription } from 'rxjs';
import type { AnyApi, NetworkName, SystemChainId } from 'types';

export class ActivePoolAccount implements Unsubscribable {
  // The associated network for this instance.
  #network: NetworkName | SystemChainId;

  // Active subscription.
  #sub: Subscription;

  // Active pool item
  pool: ActivePoolItem;

  // Address associated with this pool.
  address: string;

  // Active pool of the address.
  activePool: ActivePool | null;

  // Active pool nominations.
  poolNominations: Nominations;

  constructor(
    network: NetworkName | SystemChainId,
    address: string,
    pool: ActivePoolItem
  ) {
    this.#network = network;
    this.pool = pool;
    this.address = address;
    this.subscribe();
  }

  subscribe = async (): Promise<void> => {
    try {
      const { pApi } = ApiController.get(this.#network);
      const { pApi: peopleApi } = ApiController.get(
        `people-${this.#network}` as SystemChainId
      );
      const bestOrFinalized = 'best';

      const sub = combineLatest([
        pApi.query.NominationPools.BondedPools.watchValue(
          this.pool.id,
          bestOrFinalized
        ),
        pApi.query.NominationPools.RewardPools.watchValue(
          this.pool.id,
          bestOrFinalized
        ),
        pApi.query.System.Account.watchValue(
          this.pool.addresses.reward,
          bestOrFinalized
        ),
        pApi.query.Staking.Nominators.watchValue(
          this.pool.addresses.stash,
          bestOrFinalized
        ),
      ]).subscribe(async ([bondedPool, rewardPool, account, nominators]) => {
        await this.handleActivePoolCallback(
          peopleApi,
          bondedPool,
          rewardPool,
          account
        );
        this.handleNominatorsCallback(nominators);

        if (this.activePool && this.poolNominations) {
          document.dispatchEvent(
            new CustomEvent('new-active-pool', {
              detail: {
                address: this.address,
                pool: this.activePool,
                nominations: this.poolNominations,
              },
            })
          );
        }
      });

      this.#sub = sub;
    } catch (e) {
      // Subscription failed.
    }
  };

  // Handle active pool callback.
  handleActivePoolCallback = async (
    peopleApi: PapiApi,
    bondedPool: AnyApi,
    rewardPool: AnyApi,
    account: AnyApi
  ): Promise<void> => {
    const balance = account.data;
    const rewardAccountBalance = balance?.free.toString();

    if (peopleApi) {
      // Fetch identities for roles and expand `bondedPool` state to store them.
      bondedPool.roleIdentities = await IdentitiesController.fetch(
        peopleApi,
        this.getUniqueRoleAddresses(bondedPool.roles)
      );
    }

    const bondedPoolFormatted = {
      points: bondedPool.points.toString(),
      memberCounter: bondedPool.member_counter.toString(),
      roles: bondedPool.roles,
      roleIdentities: bondedPool.roleIdentities,
      state: bondedPool.state.type,
    };

    const rewardPoolFormatted = {
      lastRecordedRewardCounter:
        rewardPool.last_recorded_reward_counter.toString(),
      lastRecordedTotalPayouts:
        rewardPool.last_recorded_total_payouts.toString(),
      totalCommissionClaimed: rewardPool.total_commission_claimed.toString(),
      totalCommissionPending: rewardPool.total_commission_pending.toString(),
      totalRewardsClaimed: rewardPool.total_rewards_claimed.toString(),
    };

    // Only persist the active pool to class state (and therefore dispatch an event) if both the
    // bonded pool and reward pool are returned.
    if (bondedPool && rewardPool) {
      const newPool = {
        id: Number(this.pool.id),
        addresses: this.pool.addresses,
        bondedPool: bondedPoolFormatted,
        rewardPool: rewardPoolFormatted,
        rewardAccountBalance,
      };

      this.activePool = newPool;
    } else {
      // Invalid pools were returned. To signal pool was synced, set active pool to `null`.
      this.activePool = null;
    }
  };

  // Handle nominators callback.
  handleNominatorsCallback = (nominators: AnyApi): void => {
    const newNominations: Nominations = !nominators
      ? defaultPoolNominations
      : {
          targets: nominators.targets,
          submittedIn: nominators.submitted_in,
        };
    this.poolNominations = newNominations;
  };

  // Gets unique role addresses from a bonded pool's `roles` record.
  getUniqueRoleAddresses = (roles: PoolRoles): string[] => {
    const roleAddresses: string[] = [
      ...new Set(Object.values(roles).filter((role) => role !== undefined)),
    ];
    return roleAddresses;
  };

  // Unsubscribe from class subscription.
  unsubscribe = (): void => {
    if (typeof this.#sub?.unsubscribe === 'function') {
      this.#sub.unsubscribe();
    }
  };
}
