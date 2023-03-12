// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ProxyAccount } from 'contexts/Accounts/Proxies/type';
import type {
  ExtensionAccount,
  ExtensionInjected,
} from 'contexts/Extensions/types';
import type { MaybeAccount } from 'types';

export interface ConnectContextInterface {
  formatAccountSs58: (a: string) => string | null;
  connectExtensionAccounts: (e: ExtensionInjected) => Promise<void>;
  getAccount: (account: MaybeAccount) => ExtensionAccount | null;
  connectToAccount: (a: ExtensionAccount) => void;
  disconnectFromAccount: () => void;
  addExternalAccount: (a: string, addedBy: string) => void;
  getActiveAccount: () => string | null;
  accountHasSigner: (a: MaybeAccount) => boolean;
  isReadOnlyAccount: (a: MaybeAccount) => boolean;
  forgetAccounts: (a: Array<ExternalAccount>) => void;
  accounts: Array<ExtensionAccount>;
  activeAccount: string | null;
  activeAccountMeta: ExtensionAccount | null;
}

export type ImportedAccount = ExtensionAccount | ExternalAccount | ProxyAccount;

export interface ExternalAccount {
  address: string;
  network: string;
  name: string;
  source: string;
  addedBy: string;
}

export interface HandleImportExtension {
  newAccounts: Array<ExtensionAccount>;
  meta: {
    removedActiveAccount: MaybeAccount;
  };
}
