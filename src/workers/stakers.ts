// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import type { AnyJson } from 'types';

// eslint-disable-next-line no-restricted-globals
export const ctx: Worker = self as any;

// handle incoming message and route to correct handler.
ctx.addEventListener('message', (event: AnyJson) => {
  const { data } = event;
  const { task } = data;
  let message: AnyJson = {};
  switch (task) {
    case 'initialise_exposures':
      message = processExposures(data);
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
const processExposures = (data: AnyJson) => {
  const { units, exposures, activeAccount } = data;

  const stakers: any = [];
  let activeValidators = 0;
  const activeAccountOwnStake: Array<any> = [];
  const nominators: any = [];

  exposures.forEach(({ keys, val }: any) => {
    const address = keys[1];
    activeValidators++;
    stakers.push({
      address,
      ...val,
    });

    // sort `others` by value bonded, largest first
    let others = val?.others ?? [];
    others = others.sort((a: any, b: any) => {
      const x = new BigNumber(rmCommas(a.value));
      const y = new BigNumber(rmCommas(b.value));
      return y.minus(x);
    });

    // accumulate active nominators and min active stake threshold.
    if (others.length) {
      // accumulate active stake for all nominators
      for (const o of others) {
        const value = new BigNumber(rmCommas(o.value));

        // check nominator already exists
        const index = nominators.findIndex((_o: any) => _o.who === o.who);

        // add value to nominator, otherwise add new entry
        if (index === -1) {
          nominators.push({
            who: o.who,
            value,
          });
        } else {
          nominators[index].value = new BigNumber(nominators[index].value)
            .plus(value)
            .toString();
        }
      }

      // get own stake if present
      const own = others.find((_o: any) => _o.who === activeAccount);
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

/**
 * Converts an on chain balance value in BigNumber planck to a decimal value in token unit. (1 token
 * token = 10^units planck).
 */
export const planckToUnit = (val: BigNumber, units: number) =>
  new BigNumber(
    val.dividedBy(new BigNumber(10).exponentiatedBy(units)).toFixed(units)
  );

export const rmCommas = (val: string): string => val.replace(/,/g, '');


export default null as any;
