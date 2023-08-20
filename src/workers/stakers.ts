// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit, rmCommas } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import type {
  ActiveAccountStaker,
  ExposureOther,
  Staker,
} from 'contexts/Staking/types';
import type { AnyJson } from 'types';
import type { DataInitialiseExposures } from './types';

// eslint-disable-next-line no-restricted-globals
export const ctx: Worker = self as any;

// handle incoming message and route to correct handler.
ctx.addEventListener('message', (event: AnyJson) => {
  const { data } = event;
  const { task } = data;
  let message: AnyJson = {};
  switch (task) {
    case 'initialise_exposures':
      message = processExposures(data as DataInitialiseExposures);
      break;
    case 'process_fast_unstake_era':
      message = processFastUnstakeEra(data);
      break;
    default:
  }
  postMessage({ task, ...message });
});

// process fast unstake era exposures.
//
// checks if an account has been exposed in an
// era.
const processFastUnstakeEra = (data: AnyJson) => {
  const { currentEra, exposures, task, where, who } = data;
  let exposed = false;

  // check exposed as validator or nominator.
  exposures.every(({ keys, val }: any) => {
    const validator = keys[1];
    if (validator === who) {
      exposed = true;
      return false;
    }
    const others = val?.others ?? [];
    const inOthers = others.find((o: AnyJson) => o.who === who);
    if (inOthers) {
      exposed = true;
      return false;
    }
    return true;
  });

  return {
    currentEra,
    exposed,
    task,
    where,
    who,
  };
};

// process exposures.
//
// abstracts active nominators erasStakers.
const processExposures = (data: DataInitialiseExposures) => {
  const { units, exposures, activeAccount, maxNominatorRewardedPerValidator } =
    data;

  const stakers: Staker[] = [];
  let activeValidators = 0;
  const activeAccountOwnStake: ActiveAccountStaker[] = [];
  const nominators: ExposureOther[] = [];

  exposures.forEach(({ keys, val }) => {
    activeValidators++;

    const address = keys[1];
    let others = val?.others ?? [];

    // Accumulate active nominators and min active stake threshold.
    if (others.length) {
      // Sort `others` by value bonded, largest first.
      others = others.sort((a, b) => {
        const r = new BigNumber(rmCommas(b.value)).minus(rmCommas(a.value));
        return r.isZero() ? 0 : r.isLessThan(0) ? -1 : 1;
      });

      const lowestRewardIndex = Math.min(
        maxNominatorRewardedPerValidator - 1,
        others.length
      );

      const lowestReward =
        others.length > 0
          ? planckToUnit(
              new BigNumber(others[lowestRewardIndex]?.value || 0),
              units
            ).toString()
          : '0';

      stakers.push({
        address,
        lowestReward,
        ...val,
      });

      // Accumulate active stake for all nominators.
      for (const o of others) {
        const value = new BigNumber(rmCommas(o.value));

        // Check nominator already exists.
        const index = nominators.findIndex(({ who }) => who === o.who);

        // Add value to nominator, otherwise add new entry.
        if (index === -1) {
          nominators.push({
            who: o.who,
            value: value.toString(),
          });
        } else {
          nominators[index].value = new BigNumber(nominators[index].value)
            .plus(value)
            .toString();
        }
      }

      // get own stake if present
      const own = others.find(({ who }) => who === activeAccount);
      if (own !== undefined) {
        activeAccountOwnStake.push({
          address,
          value: planckToUnit(
            new BigNumber(rmCommas(own.value)),
            units
          ).toString(),
        });
      }
    }
  });

  return {
    stakers,
    totalActiveNominators: nominators.length,
    activeAccountOwnStake,
    activeValidators,
    who: activeAccount,
  };
};

export default null as any;
