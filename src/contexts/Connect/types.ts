// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FunctionComponent, SVGProps } from 'react';
import { AnyApi, MaybeAccount } from 'types';

export interface ConnectContextInterface {
  formatAccountSs58: (a: string) => string | null;
  connectExtensionAccounts: (e: Extension) => void;
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

export interface ExtensionInteface {
  accounts: AnyApi;
  metadata: AnyApi;
  provider: AnyApi;
  signer: AnyApi;
}

export interface Extension {
  id: string;
  title: string;
  icon: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >;
  enable: (n: string) => Promise<ExtensionInteface>;
  version: string;
}
export interface ExtensionAccount {
  addedBy?: string;
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
