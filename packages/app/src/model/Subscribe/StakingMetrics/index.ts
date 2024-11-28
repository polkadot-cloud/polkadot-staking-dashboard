// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { APIActiveEra } from 'contexts/Api/types';
import { Apis } from 'controllers/Apis';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { Subscription } from 'rxjs';
import { combineLatest } from 'rxjs';
import type { NetworkName } from 'types';
import { stringToBn } from 'utils';

export class StakingMetrics implements Unsubscribable {
  // The associated network for this instance.
  #network: NetworkName;

  #activeEra: APIActiveEra;

  #previousEra: BigNumber;

  // Active subscription.
  #sub: Subscription;

  constructor(
    network: NetworkName,
    activeEra: APIActiveEra,
    previousEra: BigNumber
  ) {
    this.#network = network;
    this.#activeEra = activeEra;
    this.#previousEra = previousEra;

    // Subscribe immediately.
    this.subscribe();
  }

  subscribe = async (): Promise<void> => {
    try {
      const api = Apis.getApi(this.#network);

      if (api && this.#sub === undefined) {
        const bestOrFinalized = 'best';
        const sub = combineLatest([
          api.query.Staking.CounterForValidators.watchValue(bestOrFinalized),
          api.query.Staking.MaxValidatorsCount.watchValue(bestOrFinalized),
          api.query.Staking.ValidatorCount.watchValue(bestOrFinalized),
          api.query.Staking.ErasValidatorReward.watchValue(
            this.#previousEra.toNumber(),
            bestOrFinalized
          ),
          api.query.Staking.ErasTotalStake.watchValue(
            this.#previousEra.toNumber(),
            bestOrFinalized
          ),
          api.query.Staking.MinNominatorBond.watchValue(bestOrFinalized),
          api.query.Staking.ErasTotalStake.watchValue(
            this.#activeEra.index.toNumber(),
            bestOrFinalized
          ),
          api.query.Staking.CounterForNominators.watchValue(bestOrFinalized),
        ]).subscribe(
          ([
            counterForValidators,
            maxValidatorsCount,
            validatorCount,
            erasValidatorReward,
            lastTotalStake,
            minNominatorBond,
            totalStaked,
            counterForNominators,
          ]) => {
            const stakingMetrics = {
              totalValidators: stringToBn(counterForValidators.toString()),
              maxValidatorsCount: stringToBn(
                maxValidatorsCount?.toString() || '0'
              ),
              validatorCount: stringToBn(validatorCount.toString()),
              lastReward: stringToBn(erasValidatorReward?.toString() || '0'),
              lastTotalStake: stringToBn(lastTotalStake.toString()),
              minNominatorBond: stringToBn(minNominatorBond.toString()),
              totalStaked: stringToBn(totalStaked.toString()),
              counterForNominators: stringToBn(counterForNominators.toString()),
            };

            document.dispatchEvent(
              new CustomEvent('new-staking-metrics', {
                detail: { stakingMetrics },
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
