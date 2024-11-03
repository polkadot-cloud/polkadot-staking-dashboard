// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { BondedAccount } from 'model/Subscribe/Bonded/types';
import type { MaybeAddress } from 'types';

export interface BondedContextInterface {
  getBondedAccount: (address: MaybeAddress) => string | null;
  bondedAccounts: BondedAccount[];
}
