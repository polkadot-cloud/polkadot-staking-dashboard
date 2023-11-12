// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { BondedPoolsContextState } from '../types';

export const defaultBondedPoolsContext: BondedPoolsContextState = {
  fetchPoolsMetaBatch: (k, v: [], r) => {},
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
  poolSearchFilter: (l, k, v) => {},
  bondedPools: [],
  poolsMetaData: {},
  meta: {},
};
