// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { MaybeAccount } from 'types';

export interface TransferOptionsContextInterface {
  getTransferOptions: (a: MaybeAccount) => TransferOptions;
}

export interface TransferOptions {
  freeBalance: BN;
}
