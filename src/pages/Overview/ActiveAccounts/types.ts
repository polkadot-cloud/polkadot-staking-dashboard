// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAccount } from 'types';

export interface ActiveAccountProps {
  address: MaybeAccount;
  delegate?: MaybeAccount;
}
