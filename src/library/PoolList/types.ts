// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface PoolListProps {
  allowMoreCols?: string;
  allowSearch?: boolean;
  pagination?: number;
  batchKey?: string;
  disableThrottle?: boolean;
  refetchOnListUpdate?: string;
  pools?: any;
  title?: string;
  defaultFilters?: {
    includes: Array<string> | null;
    excludes: Array<string> | null;
  };
}
