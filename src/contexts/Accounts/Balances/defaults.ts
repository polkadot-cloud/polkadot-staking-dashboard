// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import type {
  BalancesContextInterface,
  Nominations,
} from 'contexts/Accounts/Balances/types';

export const nominations: Nominations = {
  targets: [],
  submittedIn: 0,
};

export const defaultBalancesContext: BalancesContextInterface = {
  // eslint-disable-next-line
  getAccount: (address) => null,
  // eslint-disable-next-line
  // eslint-disable-next-line
  getBondedAccount: (address) => null,
  // eslint-disable-next-line
  getAccountNominations: (address) => [],
  // eslint-disable-next-line
  isController: (address) => false,
  balances: [],
  existentialAmount: new BigNumber(0),
};
