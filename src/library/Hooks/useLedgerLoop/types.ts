// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LedgerTask } from 'contexts/Hardware/types';

export interface LederLoopProps {
  tasks: Array<LedgerTask>;
  options: {
    accountIndex?: () => number;
    payload?: () => string;
  };
  mounted: () => boolean;
}
