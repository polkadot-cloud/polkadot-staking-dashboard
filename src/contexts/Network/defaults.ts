// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

export const state = {
  activeEra: {
    index: 0,
    start: 0,
  },
  totalIssuance: new BN(0),
  unsub: undefined,
};
