// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ConnectContextInterface } from 'contexts/Connect/types';

export const defaultConnectContext: ConnectContextInterface = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formatAccountSs58: (a: string) => null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  connectExtensionAccounts: (e) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAccount: (a) => null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  connectToAccount: (a) => {},
  disconnectFromAccount: () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addExternalAccount: (a, b) => {},
  getActiveAccount: () => null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accountHasSigner: (a) => false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isReadOnlyAccount: (a) => false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  forgetAccounts: (a) => {},
  extensions: [],
  extensionsStatus: {},
  accounts: [],
  activeAccount: null,
  activeAccountMeta: null,
};
