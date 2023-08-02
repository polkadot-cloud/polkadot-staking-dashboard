// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyFunction, AnyJson, Sync } from 'types';

export interface ParaSyncContextInterface {
  paraSyncing: Sync;
  paraForeignAssets: Record<string, AnyFunction>;
  paraBalances: Record<string, AnyFunction>;
  getters: Record<string, AnyFunction>;
}

export type ParaBalances = Record<string, ParaBalance>;

// We are leaving the structure of `tokens` open for now as this area of state is still in
// development.
export interface ParaBalance {
  paraId: string;
  tokens: AnyJson[];
}
