// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { BondedPool } from 'contexts/Pools/BondedPools/types';
import type { PoolRewardPointsKey } from 'contexts/Pools/PoolPerformance/types';
import type { Dispatch, SetStateAction } from 'react';

export interface JoinPoolHeaderProps {
  activeTab: number;
  bondedPool: BondedPool;
  filteredBondedPools: BondedPool[];
  metadata: string;
  autoSelected: boolean;
  setActiveTab: (tab: number) => void;
  setSelectedPoolId: Dispatch<SetStateAction<number>>;
  providedPoolId: number;
}

export interface NominationsProps {
  stash: string;
  poolId: number;
}

export interface AddressSectionProps {
  address: string;
  label: string;
  helpKey?: string;
}

export interface OverviewSectionProps {
  bondedPool: BondedPool;
  performanceKey: PoolRewardPointsKey;
  graphSyncing: boolean;
}
