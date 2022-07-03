// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { WalletAccount } from '@talisman-connect/wallets';
import { MaybeAccount } from 'types';
import { ExternalAccount } from 'types/connect';

export const defaultConnectContext = {
  // eslint-disable-next-line
  formatAccountSs58: (a: string) => null,
  // eslint-disable-next-line
  connectExtensionAccounts: (n: string) => {},
  // eslint-disable-next-line
  getAccount: (account: MaybeAccount) => null,
  // eslint-disable-next-line
  connectToAccount: (a: WalletAccount) => {},
  disconnectFromAccount: () => {},
  // eslint-disable-next-line
  addExternalAccount: (a: string, addedBy: string) => {},
  getActiveAccount: () => null,
  // eslint-disable-next-line
  accountHasSigner: (a: MaybeAccount) => false,
  // eslint-disable-next-line
  isReadOnlyAccount: (a: MaybeAccount) => false,
  // eslint-disable-next-line
  forgetAccounts: (a: Array<ExternalAccount>) => {},
  extensions: [],
  extensionsStatus: {},
  accounts: [],
  activeAccount: null,
  activeAccountMeta: null,
};
