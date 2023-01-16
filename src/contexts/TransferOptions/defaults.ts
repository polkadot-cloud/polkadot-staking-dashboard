// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { TransferOptions, TransferOptionsContextInterface } from './types';

export const defaultBalancesContext: TransferOptionsContextInterface = {
  // eslint-disable-next-line
  getTransferOptions: (a) => transferOptions,
};

export const transferOptions: TransferOptions = {
  freeBalance: new BN(0),
};
