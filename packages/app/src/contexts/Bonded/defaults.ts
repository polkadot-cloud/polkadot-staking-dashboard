// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Nominations } from 'contexts/Balances/types';
import type { BondedContextInterface } from 'contexts/Bonded/types';

export const nominations: Nominations = {
  targets: [],
  submittedIn: 0,
};

export const defaultBondedContext: BondedContextInterface = {
  getBondedAccount: (address) => null,
  bondedAccounts: [],
};
