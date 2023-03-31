// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SignClient } from '@walletconnect/sign-client/dist/types/client';
import { SessionTypes } from '@walletconnect/types';
import { ExtensionAccount, ExtensionInjected } from 'contexts/Extensions/types';
import { MaybeAccount } from 'types';

export interface ConnectContextInterface {
  formatAccountSs58: (a: string) => string | null;
  connectExtensionAccounts: (e: ExtensionInjected) => void;
  getAccount: (account: MaybeAccount) => ExtensionAccount | null;
  getClient: () => SignClient | null;
  getSession: () => SessionTypes.Struct | null;
  getWcChainInfo: () => string | null;
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

export type ImportedAccount = ExtensionAccount | ExternalAccount;

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
