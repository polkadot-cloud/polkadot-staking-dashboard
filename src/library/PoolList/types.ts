// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
