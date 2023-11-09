// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { OtherAccountsContextInterface } from './types';

export const defaultOtherAccountsContext: OtherAccountsContextInterface = {
  addExternalAccount: (a, b) => null,
  addOtherAccounts: (a) => {},
  renameOtherAccount: (a, n) => {},
  importLocalOtherAccounts: (n) => {},
  forgetOtherAccounts: (a) => {},
  forgetExternalAccounts: (a) => {},
  otherAccounts: [],
  accountsInitialised: false,
};
