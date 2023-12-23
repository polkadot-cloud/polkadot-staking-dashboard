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
import type { LocalValidatorExposure } from 'contexts/Payouts/types';
import type { ProcessExposuresArgs, ProcessEraForExposureArgs } from './types';

// eslint-disable-next-line no-restricted-globals, @typescript-eslint/no-explicit-any
export const ctx: Worker = self as any;

// handle incoming message and route to correct handler.
ctx.addEventListener('message', (event: AnyJson) => {
  const { data } = event;
  const { task } = data;
  let message: AnyJson = {};
  switch (task) {
    case 'processExposures':
      message = processExposures(data as ProcessExposuresArgs);
      break;
    case 'processEraForExposure':
      message = processEraForExposure(data as ProcessEraForExposureArgs);
      break;
    default:
  }
  postMessage({ task, ...message });
});

// Process era exposures and return if an account was exposed, along with the validator they backed.
const processEraForExposure = (data: ProcessEraForExposureArgs) => {
  const {
    era,
    maxExposurePageSize,
    exposures,
    exitOnExposed,
    task,
    networkName,
    who,
  } = data;
  let exposed = false;

  // If exposed, the validator that was backed.
  const exposedValidators: Record<string, LocalValidatorExposure> = {};

  // Check exposed as validator or nominator.
  exposures.every(({ keys, val }) => {
    const validator = keys[1];
    const others = val?.others ?? [];
    const own = val?.own || '0';
    const total = val?.total || '0';
    const isValidator = validator === who;

    if (isValidator) {
      const share = new BigNumber(own).isZero()
        ? '0'
        : new BigNumber(own).dividedBy(total).toString();

      exposedValidators[validator] = {
        staked: own,
        total,
        share,
        isValidator,
        // Validator is paid regardless of page. Default to page 1.
        exposedPage: 1,
      };

      exposed = true;
      if (exitOnExposed) {
        return false;
      }
    }

    const inOthers = others.find((o) => o.who === who);

    if (inOthers) {
      const index = others.findIndex((o) => o.who === who);
      const exposedPage = Math.floor(index / Number(maxExposurePageSize));

      const share =
        new BigNumber(inOthers.value).isZero() || total === '0'
          ? '0'
          : new BigNumber(inOthers.value).dividedBy(total).toString();

      exposedValidators[validator] = {
        staked: inOthers.value,
        total,
        share,
        isValidator,
        exposedPage,
      };
      exposed = true;
      if (exitOnExposed) {
        return false;
      }
    }

    return true;
  });

  return {
    networkName,
    era,
    exposed,
    exposedValidators: Object.keys(exposedValidators).length
      ? exposedValidators
      : null,
    task,
    who,
  };
};

// process exposures.
//
// abstracts active nominators erasStakers.
const processExposures = (data: ProcessExposuresArgs) => {
  const {
    task,
    networkName,
    era,
    units,
    exposures,
    activeAccount,
    maxExposurePageSize,
  } = data;

  const stakers: Staker[] = [];
  let activeValidators = 0;
  const activeAccountOwnStake: ActiveAccountStaker[] = [];
  const nominators: ExposureOther[] = [];

  exposures.forEach(({ keys, val }) => {
    activeValidators++;

    const address = keys[1];
    let others =
      val?.others.map((o) => ({
        ...o,
        value: rmCommas(o.value),
      })) ?? [];

    // Accumulate active nominators and min active stake threshold.
    if (others.length) {
      // Sort `others` by value bonded, largest first.
      others = others.sort((a, b) => {
        const r = new BigNumber(rmCommas(b.value)).minus(rmCommas(a.value));
        return r.isZero() ? 0 : r.isLessThan(0) ? -1 : 1;
      });

      const lowestRewardIndex = Math.min(
        maxExposurePageSize - 1,
        others.length
      );

      const lowestReward =
        others.length > 0
          ? planckToUnit(
              new BigNumber(others[lowestRewardIndex]?.value || 0),
              units
            ).toString()
          : '0';

      const oversubscribed = others.length > maxExposurePageSize;

      stakers.push({
        address,
        lowestReward,
        oversubscribed,
        others,
        own: rmCommas(val.own),
        total: rmCommas(val.total),
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
    networkName,
    era,
    stakers,
    totalActiveNominators: nominators.length,
    activeAccountOwnStake,
    activeValidators,
    task,
    who: activeAccount,
  };
};
