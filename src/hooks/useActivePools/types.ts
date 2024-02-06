// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Nominations } from 'contexts/Bonded/types';
import type { ActivePool } from 'contexts/Pools/ActivePool/types';
import type { DetailActivePool } from 'static/ActivePoolsController/types';

export interface ActivePoolsProps {
  poolIds: string[];
  onCallback?: (detail: DetailActivePool) => Promise<void>;
}

export type ActivePoolsState = Record<string, ActivePool>;

export type ActiveNominationsState = Record<string, Nominations>;
