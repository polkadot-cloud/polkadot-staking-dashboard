// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { MaybeAccount } from 'types';

export interface ActiveAccountProps {
  address: MaybeAccount;
  delegate?: MaybeAccount;
}
