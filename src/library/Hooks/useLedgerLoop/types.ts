// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LedgerTask } from 'contexts/Hardware/types';
import type { AnyJson } from 'types';

export interface LederLoopProps {
  tasks: LedgerTask[];
  options: {
    uid?: number;
    accountIndex?: () => number;
    payload?: () => Promise<AnyJson>;
  };
  mounted: () => boolean;
}
