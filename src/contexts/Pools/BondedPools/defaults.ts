// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { BondedPoolsContextState } from './types';

export const defaultBondedPoolsContext: BondedPoolsContextState = {
  queryBondedPool: (poolId) => {},
  getBondedPool: (poolId) => null,
  updateBondedPools: (bondedPools) => {},
  addToBondedPools: (bondedPool) => {},
  removeFromBondedPools: (poolId) => {},
  getPoolNominationStatus: (nominator, address) => {},
  getPoolNominationStatusCode: (statuses) => '',
  getAccountPoolRoles: (address) => null,
  replacePoolRoles: (poolId, roleEdits) => {},
  poolSearchFilter: (filteredPools, searchTerm) => [],
  bondedPools: [],
  poolsMetaData: {},
  poolsNominations: {},
  updatePoolNominations: (id, nominations) => {},
  poolListActiveTab: 'Active',
  setPoolListActiveTab: (tab) => {},
};
