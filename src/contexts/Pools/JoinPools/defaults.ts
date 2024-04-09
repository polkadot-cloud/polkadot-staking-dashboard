// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { JoinPoolsContextInterface } from './types';

export const defaultJoinPoolsContext: JoinPoolsContextInterface = {
  poolsForJoin: [],
  startJoinPoolFetch: () => {},
};

export const MaxPoolsForJoin = 8;
