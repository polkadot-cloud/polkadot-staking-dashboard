// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BondedPoolsContextState } from '../types';

export const defaultBondedPoolsContext: BondedPoolsContextState = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchPoolsMetaBatch: (k, v: [], r) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryBondedPool: (p) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBondedPool: (p) => null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateBondedPools: (p) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addToBondedPools: (p) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeFromBondedPools: (p) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPoolNominationStatus: (n, o) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPoolNominationStatusCode: (t) => '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAccountRoles: (w) => null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAccountPools: (w) => null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  replacePoolRoles: (p, e) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  poolSearchFilter: (l, k, v) => {},
  bondedPools: [],
  meta: {},
};
