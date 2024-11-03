// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ActivePool } from 'contexts/Pools/ActivePool/types';
import type { DetailActivePool } from 'controllers/ActivePools/types';
import type { Nominations } from 'model/Subscribe/Balance/types';
import type { MaybeAddress } from 'types';

export interface ActivePoolsProps {
  who: MaybeAddress;
  onCallback?: (detail: DetailActivePool) => Promise<void>;
}

export type ActivePoolsState = Record<string, ActivePool | null>;

export type ActiveNominationsState = Record<string, Nominations>;
