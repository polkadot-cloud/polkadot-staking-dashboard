// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ConnectContextInterface } from 'contexts/Connect/types';

export const defaultConnectContext: ConnectContextInterface = {
  // eslint-disable-next-line
  formatAccountSs58: (a: string) => null,
  // eslint-disable-next-line
  connectExtensionAccounts: async (e) =>
    new Promise((resolve) => resolve(false)),
  // eslint-disable-next-line
  getAccount: (a) => null,
  // eslint-disable-next-line
  connectToAccount: (a) => {},
  disconnectFromAccount: () => {},
  // eslint-disable-next-line
  addExternalAccount: (a, b) => {},
  getActiveAccount: () => null,
  // eslint-disable-next-line
  accountHasSigner: (a) => false,
  // eslint-disable-next-line
  requiresManualSign: (a) => false,
  // eslint-disable-next-line
  isReadOnlyAccount: (a) => false,
  // eslint-disable-next-line
  addToAccounts: (a) => {},
  // eslint-disable-next-line
  forgetAccounts: (a) => {},
  // eslint-disable-next-line
  setActiveProxy: (p, l) => {},
  // eslint-disable-next-line
  renameImportedAccount: (a, n) => {},
  accounts: [],
  activeAccount: null,
  activeProxy: null,
};

export const defaultHandleImportExtension = {
  newAccounts: [],
  meta: {
    removedActiveAccount: null,
  },
};
