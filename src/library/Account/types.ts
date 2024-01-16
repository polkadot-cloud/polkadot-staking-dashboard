// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ActivePool } from 'contexts/Pools/ActivePools/types';
import type { MaybeAddress } from 'types';

export interface AccountProps {
  value: MaybeAddress;
  label?: string;
  readOnly?: boolean;
}

export interface PoolAccountProps {
  pool: ActivePool;
  label: string;
  syncing: boolean;
}
