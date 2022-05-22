// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { rmCommas } from '../Utils';

// eslint-disable-next-line no-restricted-globals
export const ctx: Worker = self as any;

ctx.addEventListener('message', (event: any) => {
  const { data } = event;

  const { units, exposures } = data;

  const _stakers: any = [];
  let _activeValidators: any = 0;
  const _nominators: any = [];

  exposures.forEach(({ keys, val }: any) => {
    const address = keys[1];
    _activeValidators++;

    _stakers.push({
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
      for (const o of others) {
        const _value = new BN(rmCommas(o.value));
        const index = _nominators.findIndex((_o: any) => _o.who === o.who);

        if (index === -1) {
          _nominators.push({
            who: o.who,
            value: _value,
          });
        } else {
          _nominators[index].value = _nominators[index].value.add(_value);
        }
      }
    }
  });

  // order _nominators by bond size, smallest first
  const _getMinBonds = _nominators.sort((a: any, b: any) => {
    return a.value.sub(b.value);
  });

  // get the smallest actve nominator bond
  let _minActiveBond = _getMinBonds[0]?.value ?? new BN(0);

  // convert _minActiveBond to base value
  _minActiveBond = _minActiveBond.div(new BN(10 ** units)).toNumber();

  postMessage({
    stakers: _stakers,
    activeNominators: _nominators.length,
    activeValidators: _activeValidators,
    minActiveBond: _minActiveBond,
  });
});

export default null as any;
