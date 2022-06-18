// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MaybeAccount } from 'types';
import { WalletAccount, Wallet } from '@talisman-connect/wallets';

export interface ConnectContextInterface {
  connectExtensionAccounts: (n: string) => void;
  getAccount: (account: MaybeAccount) => WalletAccount | null;
  connectToAccount: (a: WalletAccount) => void;
  disconnectFromAccount: () => void;
  getActiveAccount: () => string | null;
  extensions: Array<Wallet>;
  extensionsStatus: { [key: string]: string };
  accounts: Array<WalletAccount>;
  activeAccount: string | null;
  activeAccountMeta: WalletAccount | null;
}
