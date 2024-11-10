// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TimeLeftFormatted } from 'hooks/useTimeLeft/types';

export interface CountdownProps {
  timeleft: TimeLeftFormatted;
  markup?: boolean;
}
