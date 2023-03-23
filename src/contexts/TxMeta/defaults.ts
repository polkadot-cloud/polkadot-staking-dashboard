// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import type { TxMetaContextInterface } from './types';

export const defaultTxMeta: TxMetaContextInterface = {
  txFees: new BigNumber(0),
  notEnoughFunds: false,
  // eslint-disable-next-line
  setTxFees: (f) => {},
  resetTxFees: () => {},
  sender: null,
  // eslint-disable-next-line
  setSender: (s) => {},
  txFeesValid: false,
  getTxPayload: () => {},
  // eslint-disable-next-line
  setTxPayload: (p) => {},
  getTxSignature: () => null,
  // eslint-disable-next-line
  setTxSignature: (s) => {},
};
