// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyApi, AnyJson, MaybeAddress } from 'types';
import type { ActiveBondedPool } from '../ActivePool/types';
import type { AnyFilter } from 'library/Filter/types';

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
  getAccountPoolRoles: (address: MaybeAddress) => AnyApi;
  replacePoolRoles: (poolId: number, roleEdits: AnyJson) => void;
  poolSearchFilter: (filteredPools: AnyFilter, searchTerm: string) => void;
  bondedPools: BondedPool[];
  poolsMetaData: Record<number, string>;
  poolsNominations: Record<number, PoolNominations>;
  updatePoolNominations: (id: number, nominations: string[]) => void;
}

export type BondedPool = ActiveBondedPool & {
  addresses: PoolAddresses;
  id: number;
  commission?: {
    current?: AnyJson | null;
    max?: AnyJson | null;
    changeRate: {
      maxIncrease: AnyJson;
      minDelay: AnyJson;
    } | null;
    throttleFrom?: AnyJson | null;
  };
};

export interface PoolAddresses {
  stash: string;
  reward: string;
}

export type MaybePool = number | null;

export type PoolNominations = {
  submittedIn: string;
  suppressed: boolean;
  targets: string[];
} | null;

export type NominationStatuses = Record<string, string>;

export type AccountPoolRoles = {
  root: number[];
  depositor: number[];
  nominator: number[];
  bouncer: number[];
} | null;
