// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { AnyJson } from 'types';
import { planckBnToUnit, rmCommas } from 'Utils';

// eslint-disable-next-line no-restricted-globals
export const ctx: Worker = self as any;

ctx.addEventListener('message', (event: AnyJson) => {
  const { data } = event;
  const { task } = data;

  let message = {};

  switch (task) {
    case 'initialise_exposures':
      message = processExposures(data);
      break;
    default:
  }

  postMessage({ task, ...message });
});

// process exposure
//
// abstracts active nominators and minimum active
// bond from erasStakers.
const processExposures = (data: AnyJson) => {
  const { units, exposures, activeAccount } = data;

  const stakers: any = [];
  let activeValidators = 0;
  const ownStake: Array<any> = [];
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
      const x = new BN(rmCommas(a.value));
      const y = new BN(rmCommas(b.value));
      return y.sub(x);
    });

    // accumulate active nominators and min active bond threshold.
    if (others.length) {
      // accumulate active bond for all nominators
      for (const o of others) {
        const _value = new BN(rmCommas(o.value));

        // check nominator already exists
        const index = nominators.findIndex((_o: any) => _o.who === o.who);

        // add value to nominator, otherwise add new entry
        if (index === -1) {
          nominators.push({
            who: o.who,
            value: _value,
          });
        } else {
          nominators[index].value = nominators[index].value.add(_value);
        }
      }

      // get own stake if present
      const own = others.find((_o: any) => _o.who === activeAccount);
      if (own !== undefined) {
        ownStake.push({
          address,
          value: planckBnToUnit(new BN(rmCommas(own.value)), units),
        });
      }
    }
  });

  // order nominators by bond size, smallest first
  const _getMinBonds = nominators.sort((a: any, b: any) => {
    return a.value.sub(b.value);
  });

  // get the smallest actve nominator bond
  let minActiveBond = _getMinBonds[0]?.value ?? new BN(0);

  // convert minActiveBond to base value
  minActiveBond = planckBnToUnit(minActiveBond, units);

  return {
    stakers,
    ownStake,
    totalActiveNominators: nominators.length,
    activeValidators,
    minActiveBond,
    _activeAccount: activeAccount,
  };
};

export default null as any;
