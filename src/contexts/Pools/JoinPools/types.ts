// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { BondedPool } from '../BondedPools/types';

export interface JoinPoolsContextInterface {
  poolsForJoin: BondedPool[];
  startJoinPoolFetch: () => void;
}
