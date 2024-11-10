// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnySubscan } from 'types';

export interface PayoutListProps {
  allowMoreCols?: boolean;
  pagination?: boolean;
  title?: string | null;
  payoutsList?: AnySubscan;
  payouts?: AnySubscan;
}
