// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TxSubmissionItem } from 'api/types';
import type BigNumber from 'bignumber.js';
import type { MaybeAddress } from 'types';

export interface TxMetaContextInterface {
  uids: TxSubmissionItem[];
  getTxSubmission: (uid?: number) => TxSubmissionItem | undefined;
  setSender: (s: MaybeAddress) => void;
  txFees: BigNumber;
  txFeesValid: boolean;
  setTxFees: (f: BigNumber) => void;
  resetTxFees: () => void;
  notEnoughFunds: boolean;
}
