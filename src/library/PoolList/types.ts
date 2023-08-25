// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type ListFormat = 'row' | 'col';

export interface PoolListContextProps {
  setListFormat: (v: ListFormat) => void;
  listFormat: ListFormat;
}
export interface PoolListProps {
  allowMoreCols?: boolean;
  allowSearch?: boolean;
  pagination?: boolean;
  batchKey?: string;
  disableThrottle?: boolean;
  refetchOnListUpdate?: string;
  pools?: any;
  title?: string;
  defaultFilters?: {
    includes: string[] | null;
    excludes: string[] | null;
  };
}
