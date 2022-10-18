// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { EstimatedFeeContext } from '.';

export const defaultTxFees: EstimatedFeeContext = {
  txFees: new BN(0),
  notEnoughFunds: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTxFees: (f) => {},
  resetTxFees: () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSender: (s) => {},
  txFeesValid: false,
};
