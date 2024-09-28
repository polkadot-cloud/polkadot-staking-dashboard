// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import BigNumber from 'bignumber.js';
import type { TxMetaContextInterface } from './types';

export const defaultTxMeta: TxMetaContextInterface = {
  sender: null,
  setSender: (s) => {},
  txFees: new BigNumber(0),
  txFeesValid: false,
  setTxFees: (f) => {},
  resetTxFees: () => {},
  notEnoughFunds: false,
  getPayloadUid: () => 0,
  getTxMetadata: () => {},
  getTxPayload: () => {},
  setTxPayload: (payload, payloadValue, uid) => {},
  incrementPayloadUid: () => 0,
  resetTxPayload: () => {},
  getTxSignature: () => null,
  setTxSignature: (s) => {},
  pendingNonces: [],
  addPendingNonce: (nonce) => {},
  removePendingNonce: (nonce) => {},
  controllerSignerAvailable: (a, b) => 'ok',
};
