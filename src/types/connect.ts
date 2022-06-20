// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MaybeAccount } from 'types';
import { WalletAccount, Wallet } from '@talisman-connect/wallets';

export interface ConnectContextInterface {
  connectExtensionAccounts: (n: string) => void;
  getAccount: (account: MaybeAccount) => WalletAccount | null;
  connectToAccount: (a: WalletAccount) => void;
  disconnectFromAccount: () => void;
  addExternalAccount: (a: string) => void;
  getActiveAccount: () => string | null;
  accountHasSigner: (a: MaybeAccount) => boolean;
  extensions: Array<Wallet>;
  extensionsStatus: { [key: string]: string };
  accounts: Array<WalletAccount>;
  activeAccount: string | null;
  activeAccountMeta: WalletAccount | null;
}

export type ImportedAccount = WalletAccount | ExternalAccount;

export interface ExternalAccount {
  address: string;
  network: string;
  name: string;
  source: string;
  addedBy: string;
}
