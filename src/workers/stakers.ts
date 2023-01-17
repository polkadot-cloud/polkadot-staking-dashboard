// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { AnyJson } from 'types';
import { planckToUnit, rmCommas } from 'Utils';

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
// abstracts active nominators and minimum active
// bond from erasStakers.
const processExposures = (data: AnyJson) => {
  const { units, exposures, activeAccount } = data;

  const stakers: any = [];
  let activeValidators = 0;
  const ownStake: Array<any> = [];
  const nominators: any = [];
  let totalStaked = new BigNumber(0);

  exposures.forEach(({ keys, val }: any) => {
    const address = keys[1];
    const total = val?.total
      ? new BigNumber(rmCommas(val.total))
      : new BigNumber(0);
    totalStaked = totalStaked.plus(total);
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

    // accumulate active nominators and min active bond threshold.
    if (others.length) {
      // accumulate active bond for all nominators
      for (const o of others) {
        const _value = new BigNumber(rmCommas(o.value));

        // check nominator already exists
        const index = nominators.findIndex((_o: any) => _o.who === o.who);

        // add value to nominator, otherwise add new entry
        if (index === -1) {
          nominators.push({
            who: o.who,
            value: _value,
          });
        } else {
          nominators[index].value = nominators[index].value.plus(_value);
        }
      }

      // get own stake if present
      const own = others.find((_o: any) => _o.who === activeAccount);
      if (own !== undefined) {
        ownStake.push({
          address,
          value: planckToUnit(new BigNumber(rmCommas(own.value)), units),
        });
      }
    }
  });

  // order nominators by bond size, smallest first
  const _getMinBonds = nominators.sort((a: any, b: any) => {
    return a.value.minus(b.value);
  });

  // get the smallest actve nominator bond
  let minActiveBond = _getMinBonds[0]?.value ?? new BigNumber(0);

  // convert minActiveBond to base value
  minActiveBond = planckToUnit(minActiveBond, units);

  return {
    stakers,
    totalStaked: totalStaked.toString(),
    ownStake,
    totalActiveNominators: nominators.length,
    activeValidators,
    minActiveBond,
    _activeAccount: activeAccount,
  };
};

export default null as any;
