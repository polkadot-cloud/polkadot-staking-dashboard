// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from "bn.js";
import { rmCommas } from '../Utils';

// eslint-disable-next-line no-restricted-globals
export const ctx: Worker = self as any;

ctx.addEventListener('message', (event: any) => {

  const { data } = event;

  const {
    units,
    exposures,
    maxNominatorRewardedPerValidator,
  } = data;

  let _stakers: any = [];
  let _activeValidators: any = 0;
  let _nominators: any = [];

  exposures.forEach(({ keys, val }: any) => {
    let address = keys[1];
    _activeValidators++;

    _stakers.push({
      address: address,
      ...val
    });

    let others = val?.others ?? [];
    others = others.sort((a: any, b: any) => {
      let x = new BN(rmCommas(a.value));
      let y = new BN(rmCommas(b.value));
      return x.sub(y);
    });

    // accumulate active nominators and min active bond threshold.
    if (others.length) {
      for (let o of others) {
        let _value = new BN(rmCommas(o.value));
        var index = _nominators.findIndex((_o: any) => _o.who === o.who);

        if (index === -1) {
          _nominators.push({
            who: o.who,
            value: _value
          });
        } else {
          _nominators[index].value = _nominators[index].value.add(_value);
        }
      }
    }
  });

  // order _nominators by bond size, largest first
  let _getMinBonds = _nominators.sort((a: any, b: any) => {
    return a.value.sub(b.value);
  }).splice(0, (maxNominatorRewardedPerValidator));

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