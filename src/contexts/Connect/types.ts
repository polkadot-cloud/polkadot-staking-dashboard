// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MaybeAccount } from 'types';

export interface ConnectContextInterface {
  formatAccountSs58: (a: string) => string | null;
  connectExtensionAccounts: (n: string) => void;
  getAccount: (account: MaybeAccount) => ExtensionAccount | null;
  connectToAccount: (a: ExtensionAccount) => void;
  disconnectFromAccount: () => void;
  addExternalAccount: (a: string, addedBy: string) => void;
  getActiveAccount: () => string | null;
  accountHasSigner: (a: MaybeAccount) => boolean;
  isReadOnlyAccount: (a: MaybeAccount) => boolean;
  forgetAccounts: (a: Array<ExternalAccount>) => void;
  extensions: Array<Extension>;
  extensionsStatus: { [key: string]: string };
  accounts: Array<ExtensionAccount>;
  activeAccount: string | null;
  activeAccountMeta: ExtensionAccount | null;
}

export interface Extension {
  extensionName: string;
  title: string;
  enable: (n: string) => void;
}
export interface ExtensionAccount {
  addedBy: string;
  address: string;
  source: string;
  name?: string;
  signer?: unknown;
}
export type ImportedAccount = ExtensionAccount | ExternalAccount;

export interface ExternalAccount {
  address: string;
  network: string;
  name: string;
  source: string;
  addedBy: string;
}
