// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { AnyApi } from 'common-types';
import type { AnyFilter } from 'library/Filter/types';
import type { Dispatch, SetStateAction } from 'react';
import type {
  BondedPool,
  MaybeAddress,
  NominationStatuses,
  PoolNominations,
  PoolTab,
} from 'types';

export interface BondedPoolsContextState {
  queryBondedPool: (poolId: number) => AnyApi;
  getBondedPool: (poolId: number) => BondedPool | null;
  updateBondedPools: (bondedPools: BondedPool[]) => void;
  addToBondedPools: (bondedPool: BondedPool) => void;
  removeFromBondedPools: (poolId: number) => void;
  getPoolNominationStatus: (
    nominator: MaybeAddress,
    address: MaybeAddress
  ) => AnyApi;
  getPoolNominationStatusCode: (statuses: NominationStatuses | null) => string;
  replacePoolRoles: (poolId: number, roleEdits: AnyJson) => void;
  poolSearchFilter: (filteredPools: AnyFilter, searchTerm: string) => AnyJson[];
  bondedPools: BondedPool[];
  poolsMetaData: Record<number, string>;
  poolsNominations: Record<number, PoolNominations>;
  updatePoolNominations: (id: number, nominations: string[]) => void;
  poolListActiveTab: PoolTab;
  setPoolListActiveTab: Dispatch<SetStateAction<PoolTab>>;
}
