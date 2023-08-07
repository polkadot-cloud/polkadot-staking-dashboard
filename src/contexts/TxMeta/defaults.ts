// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import type { TxMetaContextInterface } from './types';

export const defaultTxMeta: TxMetaContextInterface = {
  // eslint-disable-next-line
  controllerSignerAvailable: (a, b) => 'ok',
  txFees: new BigNumber(0),
  notEnoughFunds: false,
  // eslint-disable-next-line
  setTxFees: (f) => {},
  resetTxFees: () => {},
  sender: null,
  // eslint-disable-next-line
  setSender: (s) => {},
  txFeesValid: false,
  incrementPayloadUid: () => 0,
  getPayloadUid: () => 0,
  getTxPayload: () => {},
  // eslint-disable-next-line
  setTxPayload: (p, u) => {},
  getTxSignature: () => null,
  // eslint-disable-next-line
  resetTxPayloads: () => {},
  // eslint-disable-next-line
  setTxSignature: (s) => {},
};
