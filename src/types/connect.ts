// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MaybeAccount } from 'types';

export interface ConnectContextInterface {
  initialise: () => void;
  connectExtension: (w: string) => void;
  disconnectExtension: () => void;
  accountExists: (a: string) => number;
  getAccount: (account: MaybeAccount) => any;
  connectToAccount: (a: any) => void;
  disconnectFromAccount: () => void;
  extensions: any;
  activeExtension: any;
  extensionErrors: any;
  accounts: any;
  activeAccount: string | null;
  activeAccountMeta: any;
}
