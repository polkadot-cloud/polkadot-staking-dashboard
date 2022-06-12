// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MaybeAccount } from 'types';

export interface ConnectContextInterface {
  getAccount: (account: MaybeAccount) => any;
  connectToAccount: (a: any) => void;
  disconnectFromAccount: () => void;
  getActiveAccount: () => any;
  extensions: any;
  extensionsStatus: any;
  accounts: any;
  activeAccount: string | null;
  activeAccountMeta: any;
}
