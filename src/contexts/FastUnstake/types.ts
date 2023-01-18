// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { AnyApi, MaybeAccount } from 'types';

export interface LocalMeta {
  isExposed: boolean;
  checked: Array<number>;
}
export interface MetaInterface {
  checked: Array<number>;
}

export interface FastUnstakeContextInterface {
  getLocalkey: (a: MaybeAccount) => string;
  checking: boolean;
  meta: MetaInterface;
  isExposed: boolean | null;
  queueDeposit: BigNumber | null;
  head: AnyApi;
  counterForQueue: number | null;
}
