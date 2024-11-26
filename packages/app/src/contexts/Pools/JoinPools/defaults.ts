// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { JoinPoolsContextInterface } from './types';

export const defaultJoinPoolsContext: JoinPoolsContextInterface = {
  poolsForJoin: [],
  startJoinPoolFetch: () => {},
};

export const MaxPoolsForJoin = 8;
