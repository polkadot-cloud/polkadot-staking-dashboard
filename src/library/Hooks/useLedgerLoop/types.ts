// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LedgerTask } from 'contexts/Hardware/types';
import type { AnyJson } from 'types';

export interface LederLoopProps {
  task: LedgerTask;
  options: {
    uid?: number;
    accountIndex?: () => number;
    payload?: () => Promise<AnyJson>;
  };
  mounted: () => boolean;
}
