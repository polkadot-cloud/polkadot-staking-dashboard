// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { APIActiveEra } from 'contexts/Api/types';
import { ApiController } from 'controllers/Api';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { NetworkName } from 'types';
import { stringToBn } from 'library/Utils';
import type { Subscription } from 'rxjs';
import { combineLatest } from 'rxjs';

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
      const { pApi } = ApiController.get(this.#network);

      if (pApi && this.#sub === undefined) {
        const sub = combineLatest([
          pApi.query.Staking.CounterForValidators.watchValue(),
          pApi.query.Staking.MaxValidatorsCount.watchValue(),
          pApi.query.Staking.ValidatorCount.watchValue(),
          pApi.query.Staking.ErasValidatorReward.watchValue(
            this.#previousEra.toString()
          ),
          pApi.query.Staking.ErasTotalStake.watchValue(
            this.#previousEra.toString()
          ),
          pApi.query.Staking.MinNominatorBond.watchValue(),
          pApi.query.Staking.ErasTotalStake.watchValue(
            this.#activeEra.index.toString()
          ),
          pApi.query.Staking.CounterForNominators.watchValue(),
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
              maxValidatorsCount: stringToBn(maxValidatorsCount.toString()),
              validatorCount: stringToBn(validatorCount.toString()),
              lastReward: stringToBn(erasValidatorReward.toString()),
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
