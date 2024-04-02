// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { BondedPool } from 'contexts/Pools/BondedPools/types';
import type { Validator } from 'contexts/Validators/types';
import type { Dispatch, SetStateAction } from 'react';

export interface JoinPoolHeaderProps {
  activeTab: number;
  bondedPool: BondedPool;
  filteredBondedPools: BondedPool[];
  metadata: string;
  autoSelected: boolean;
  setActiveTab: (tab: number) => void;
  setSelectedPoolId: Dispatch<SetStateAction<number>>;
  setSelectedPoolCount: Dispatch<SetStateAction<number>>;
}

export interface NominationsProps {
  stash: string;
  targets: Validator[];
}

export interface AddressSectionProps {
  address: string;
  label: string;
  helpKey?: string;
}
