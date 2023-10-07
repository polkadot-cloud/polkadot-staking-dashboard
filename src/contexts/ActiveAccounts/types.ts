// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAccount } from 'types';

export interface ActiveAccountsContextInterface {
  activeAccount: MaybeAccount;
  activeProxy: MaybeAccount;
  activeProxyType: string | null;
  getActiveAccount: () => string | null;
  setActiveAccount: (address: MaybeAccount, updateLocal?: boolean) => void;
  setActiveProxy: (address: ActiveProxy, updateLocal?: boolean) => void;
}

export type ActiveProxy = {
  address: MaybeAccount;
  proxyType: string;
} | null;
