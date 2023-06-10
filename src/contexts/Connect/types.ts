// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  ExtensionAccount,
  ExtensionInjected,
} from 'contexts/Extensions/types';
import type { MaybeAccount } from 'types';

export interface ConnectContextInterface {
  formatAccountSs58: (a: string) => string | null;
  connectExtensionAccounts: (e: ExtensionInjected) => Promise<boolean>;
  getAccount: (account: MaybeAccount) => ExtensionAccount | null;
  connectToAccount: (a: ImportedAccount | null) => void;
  disconnectFromAccount: () => void;
  addExternalAccount: (a: string, addedBy: string) => void;
  getActiveAccount: () => string | null;
  accountHasSigner: (a: MaybeAccount) => boolean;
  requiresManualSign: (a: MaybeAccount) => boolean;
  isReadOnlyAccount: (a: MaybeAccount) => boolean;
  addToAccounts: (a: ImportedAccount[]) => void;
  forgetAccounts: (a: ImportedAccount[]) => void;
  setActiveProxy: (p: ActiveProxy, l?: boolean) => void;
  renameImportedAccount: (a: MaybeAccount, n: string) => void;
  accounts: ExtensionAccount[];
  activeAccount: MaybeAccount;
  activeProxy: MaybeAccount;
}

export type ImportedAccount =
  | ExtensionAccount
  | ExternalAccount
  | LedgerAccount;

export interface ExternalAccount {
  address: string;
  network: string;
  name: string;
  source: string;
  addedBy: string;
}

export interface LedgerAccount {
  address: string;
  network: string;
  name: string;
  source: string;
  index: number;
}

export interface VaultAccount {
  address: string;
  network: string;
  name: string;
  source: string;
  index: number;
}

export interface HandleImportExtension {
  newAccounts: ExtensionAccount[];
  meta: {
    removedActiveAccount: MaybeAccount;
  };
}

export type ActiveProxy = {
  address: MaybeAccount;
  proxyType: string;
} | null;
