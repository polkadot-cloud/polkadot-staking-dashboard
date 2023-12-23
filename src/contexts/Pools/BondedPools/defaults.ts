// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { BondedPoolsContextState } from './types';

export const defaultBondedPoolsContext: BondedPoolsContextState = {
  queryBondedPool: (p) => {},
  getBondedPool: (p) => null,
  updateBondedPools: (p) => {},
  addToBondedPools: (p) => {},
  removeFromBondedPools: (p) => {},
  getPoolNominationStatus: (n, o) => {},
  getPoolNominationStatusCode: (t) => '',
  getAccountRoles: (w) => null,
  getAccountPools: (w) => null,
  replacePoolRoles: (p, e) => {},
  poolSearchFilter: (l, v) => {},
  bondedPools: [],
  poolsMetaData: {},
  poolsNominations: {},
  updatePoolNominations: (id, nominations) => {},
};
