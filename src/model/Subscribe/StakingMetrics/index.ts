// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import { rmCommas } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import type { APIActiveEra } from 'contexts/Api/types';
import { ApiController } from 'controllers/Api';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { NetworkName } from 'types';

export class StakingMetrics implements Unsubscribable {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated network for this instance.
  #network: NetworkName;

  #activeEra: APIActiveEra;

  #previousEra: BigNumber;

  // Unsubscribe object.
  #unsub: VoidFn;

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

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

  // ------------------------------------------------------
  // Subscription.
  // ------------------------------------------------------

  subscribe = async (): Promise<void> => {
    try {
      const { api } = ApiController.get(this.#network);

      if (api && this.#unsub === undefined) {
        const unsub = await api.queryMulti(
          [
            api.query.staking.counterForNominators,
            api.query.staking.counterForValidators,
            api.query.staking.maxValidatorsCount,
            api.query.staking.validatorCount,
            [
              api.query.staking.erasValidatorReward,
              this.#previousEra.toString(),
            ],
            [api.query.staking.erasTotalStake, this.#previousEra.toString()],
            api.query.staking.minNominatorBond,
            [
              api.query.staking.erasTotalStake,
              this.#activeEra.index.toString(),
            ],
          ],
          (result) => {
            const stakingMetrics = {
              totalNominators: this.stringToBigNumber(result[0].toString()),
              totalValidators: this.stringToBigNumber(result[1].toString()),
              maxValidatorsCount: this.stringToBigNumber(result[2].toString()),
              validatorCount: this.stringToBigNumber(result[3].toString()),
              lastReward: this.stringToBigNumber(result[4].toString()),
              lastTotalStake: this.stringToBigNumber(result[5].toString()),
              minNominatorBond: this.stringToBigNumber(result[6].toString()),
              totalStaked: this.stringToBigNumber(result[7].toString()),
            };

            document.dispatchEvent(
              new CustomEvent(`new-staking-metrics`, {
                detail: { stakingMetrics },
              })
            );
          }
        );
        // Subscription now initialised. Store unsub.
        this.#unsub = unsub as unknown as VoidFn;
      }
    } catch (e) {
      // Block number subscription failed.
    }
  };

  // ------------------------------------------------------
  // Unsubscribe handler.
  // ------------------------------------------------------

  // Unsubscribe from class subscription.
  unsubscribe = (): void => {
    if (typeof this.#unsub === 'function') {
      this.#unsub();
    }
  };

  // ------------------------------------------------------
  // Utils.
  // ------------------------------------------------------

  // Convert string to BigNumber.
  stringToBigNumber = (value: string): BigNumber =>
    new BigNumber(rmCommas(value));
}
