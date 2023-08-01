// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Sync } from 'types';

export interface ParaSyncContextInterface {
  paraSyncing: Sync;
  paraForeignAssets: Record<string, any>;
  paraBalances: Record<string, any>;
  getters: Record<string, any>;
}
