// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface FastUnstakeConfigResult {
  head: FastUnstakeHead;
  counterForQueue: number;
}

export interface FastUnstakeHead {
  stashes: [string, bigint][];
  checked: number[];
}