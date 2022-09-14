// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { EstimatedFeeContext } from '.';

export const defaultTxFees: EstimatedFeeContext = {
  txFees: new BN(0),
  notEnoughFunds: false,
  // eslint-disable-next-line
  setTxFees: (f) => {},
  resetTxFees: () => {},
};
