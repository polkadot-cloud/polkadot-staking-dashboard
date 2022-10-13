// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BondedPoolsContextState } from '../types';

export const defaultBondedPoolsContext: BondedPoolsContextState = {
  // eslint-disable-next-line
  fetchPoolsMetaBatch: (k, v: [], r) => {},
  // eslint-disable-next-line
  queryBondedPool: (p) => {},
  // eslint-disable-next-line
  getBondedPool: (p) => null,
  // eslint-disable-next-line
  updateBondedPools: (p) => {},
  // eslint-disable-next-line
  addToBondedPools: (p) => {},
  // eslint-disable-next-line
  removeFromBondedPools: (p) => {},
  // eslint-disable-next-line
  getPoolNominationStatus: (n, o) => {},
  // eslint-disable-next-line
  getPoolNominationStatusCode: (t) => '',
  // eslint-disable-next-line
  getAccountRoles: (w) => null,
  // eslint-disable-next-line
  getAccountPools: (w) => null,
  // eslint-disable-next-line
  replacePoolRoles: (p, e) => {},
  // eslint-disable-next-line
   poolSearchFilter: (l, k, v) => {},
  bondedPools: [],
  meta: {},
};
