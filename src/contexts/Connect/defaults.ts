// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ConnectContextInterface } from 'contexts/Connect/types';

export const defaultConnectContext: ConnectContextInterface = {
  // eslint-disable-next-line
  formatAccountSs58: (a: string) => null,
  // eslint-disable-next-line
  connectExtensionAccounts: (n: string) => {},
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
  isReadOnlyAccount: (a) => false,
  // eslint-disable-next-line
  forgetAccounts: (a) => {},
  extensions: [],
  extensionsStatus: {},
  accounts: [],
  activeAccount: null,
  activeAccountMeta: null,
};
