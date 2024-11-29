// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import BigNumber from 'bignumber.js';
import type { TxMetaContextInterface } from './types';

export const defaultTxMeta: TxMetaContextInterface = {
  uids: [],
  sender: null,
  setSender: (s) => {},
  txFees: new BigNumber(0),
  txFeesValid: false,
  setTxFees: (f) => {},
  resetTxFees: () => {},
  notEnoughFunds: false,
  controllerSignerAvailable: (a, b) => 'ok',
};
