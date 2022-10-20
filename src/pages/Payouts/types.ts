// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnySubscan } from 'types';

export interface PayoutListProps {
  allowMoreCols?: boolean;
  pagination?: boolean;
  disableThrottle?: boolean;
  title?: string;
  payoutsList?: AnySubscan;
  payouts?: AnySubscan;
}
