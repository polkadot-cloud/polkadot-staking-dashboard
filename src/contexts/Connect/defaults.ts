// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ConnectContextInterface } from 'contexts/Connect/types';

export const defaultConnectContext: ConnectContextInterface = {
  formatAccountSs58: (a: string) => null,
  addExternalAccount: (a, b) => {},
  addOtherAccounts: (a) => {},
  forgetAccounts: (a) => {},
  renameImportedAccount: (a, n) => {},
  importLocalAccounts: (n) => {},
  otherAccounts: [],
};

export const defaultHandleImportExtension = {
  newAccounts: [],
  meta: {
    removedActiveAccount: null,
  },
};
