// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { BondedPool } from 'contexts/Pools/BondedPools/types';

export type ListFormat = 'row' | 'col';

export interface PoolListContextProps {
  setListFormat: (v: ListFormat) => void;
  listFormat: ListFormat;
}
export interface PoolListProps {
  allowMoreCols?: boolean;
  allowSearch?: boolean;
  pagination?: boolean;
  disableThrottle?: boolean;
  refetchOnListUpdate?: string;
  allowListFormat?: boolean;
  pools?: BondedPool[];
  defaultFilters?: {
    includes: string[] | null;
    excludes: string[] | null;
  };
}
