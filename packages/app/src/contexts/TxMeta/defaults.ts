// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { TxMetaContextInterface } from './types';

export const defaultTxMeta: TxMetaContextInterface = {
  uids: [],
  getTxSubmission: (uid) => undefined,
  setSender: (s) => {},
  txFees: 0n,
  txFeesValid: false,
  setTxFees: (f) => {},
  resetTxFees: () => {},
  notEnoughFunds: false,
};
