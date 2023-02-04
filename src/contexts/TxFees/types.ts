// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { MaybeAccount } from 'types';

export interface EstimatedFeeContext {
  txFees: BigNumber;
  notEnoughFunds: boolean;
  setTxFees: (f: BigNumber) => void;
  resetTxFees: () => void;
  setSender: (s: MaybeAccount) => void;
  txFeesValid: boolean;
}
