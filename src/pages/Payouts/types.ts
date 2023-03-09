// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnySubscan } from 'types';

export interface PayoutListProps {
  allowMoreCols?: boolean;
  pagination?: boolean;
  disableThrottle?: boolean;
  title?: string | null;
  payoutsList?: AnySubscan;
  payouts?: AnySubscan;
}
