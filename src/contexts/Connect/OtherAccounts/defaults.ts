// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { OtherAccountsContextInterface } from './types';

export const defaultOtherAccountsContext: OtherAccountsContextInterface = {
  addOtherAccounts: (accounts) => {},
  addOrReplaceOtherAccount: (account, type) => {},
  renameOtherAccount: (address, newName) => {},
  importLocalOtherAccounts: (network) => {},
  forgetOtherAccounts: (accounts) => {},
  otherAccounts: [],
  accountsInitialised: false,
};
