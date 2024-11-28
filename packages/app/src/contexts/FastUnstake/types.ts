// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FastUnstakeHead } from 'api/subscribe/fastUnstakeConfig/types';
import type BigNumber from 'bignumber.js';
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
  queueDeposit: FastUnstakeQueueDeposit | undefined;
  head: FastUnstakeHead | undefined;
  counterForQueue: number | undefined;
}

export interface FastUnstakeQueueDeposit {
  address: string;
  deposit: BigNumber;
}

export interface FastUnstakeQueueResult {
  address: string;
  deposit: bigint;
}
