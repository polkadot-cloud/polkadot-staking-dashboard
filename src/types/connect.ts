// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MaybeAccount } from 'types';

export interface ConnectContextInterface {
  getAccount: (account: MaybeAccount) => any;
  connectToAccount: (a: any) => void;
  disconnectFromAccount: () => void;
  setActiveExtension: (e: any) => void;
  extensions: any;
  activeExtension: any;
  accounts: any;
  activeAccount: string | null;
  activeAccountMeta: any;
}
