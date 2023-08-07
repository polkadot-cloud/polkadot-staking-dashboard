// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  BondedContextInterface,
  Nominations,
} from 'contexts/Bonded/types';

export const nominations: Nominations = {
  targets: [],
  submittedIn: 0,
};

export const defaultBondedContext: BondedContextInterface = {
  // eslint-disable-next-line
  getAccount: (address) => null,
  // eslint-disable-next-line
  getBondedAccount: (address) => null,
  // eslint-disable-next-line
  getAccountNominations: (address) => [],
  // eslint-disable-next-line
  isController: (address) => false,
  bondedAccounts: [],
};
