// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { AnyApi } from 'types';

export interface LocalMeta {
  isExposed: boolean;
  checked: Array<number>;
}
export interface MetaInterface {
  checked: Array<number>;
}

export interface FastUnstakeContextInterface {
  checking: boolean;
  meta: MetaInterface;
  isExposed: boolean | null;
  queueDeposit: BN | null;
  head: AnyApi;
  counterForQueue: number | null;
}
