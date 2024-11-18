// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { FastUnstakeHead } from 'model/Subscribe/FastUnstakeConfig/types';
import type { MaybeAddress } from 'types';

export interface LocalMeta {
  isExposed: boolean;
  checked: number[];
}
export interface MetaInterface {
  checked: number[];
}

export interface FastUnstakeContextInterface {
  getLocalkey: (address: MaybeAddress) => string;
  checking: boolean;
  meta: MetaInterface;
  isExposed: boolean | null;
  queueDeposit: BigNumber | null;
  head: FastUnstakeHead | undefined;
  counterForQueue: number | undefined;
}
