// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { AnyApi, MaybeAddress } from 'types';

export interface LocalMeta {
  isExposed: boolean;
  checked: number[];
}
export interface MetaInterface {
  checked: number[];
}

export interface FastUnstakeContextInterface {
  getLocalkey: (a: MaybeAddress) => string;
  checking: boolean;
  meta: MetaInterface;
  isExposed: boolean | null;
  queueDeposit: BigNumber | null;
  head: AnyApi;
  counterForQueue: number | null;
}
