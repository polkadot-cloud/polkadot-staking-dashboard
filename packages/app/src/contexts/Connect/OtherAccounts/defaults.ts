// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

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
