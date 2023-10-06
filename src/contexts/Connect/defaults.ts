// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ConnectContextInterface } from 'contexts/Connect/types';

export const defaultConnectContext: ConnectContextInterface = {
  formatAccountSs58: (a: string) => null,
  connectExtensionAccounts: async (e) =>
    new Promise((resolve) => resolve(false)),
  getAccount: (a) => null,
  connectToAccount: (a) => {},
  disconnectFromAccount: () => {},
  addExternalAccount: (a, b) => {},
  accountHasSigner: (a) => false,
  requiresManualSign: (a) => false,
  isReadOnlyAccount: (a) => false,
  addToAccounts: (a) => {},
  forgetAccounts: (a) => {},
  renameImportedAccount: (a, n) => {},
  importLocalAccounts: (n) => {},
  accounts: [],
};

export const defaultHandleImportExtension = {
  newAccounts: [],
  meta: {
    removedActiveAccount: null,
  },
};
