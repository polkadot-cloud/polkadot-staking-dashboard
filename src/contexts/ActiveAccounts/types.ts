// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from 'types';

export interface ActiveAccountsContextInterface {
  activeAccount: MaybeAddress;
  activeProxy: MaybeAddress;
  activeProxyType: string | null;
  getActiveAccount: () => string | null;
  setActiveAccount: (
    address: MaybeAddress,
    updateLocalStorage?: boolean
  ) => void;
  setActiveProxy: (address: ActiveProxy, updateLocalStorage?: boolean) => void;
}

export type ActiveProxy = {
  address: MaybeAddress;
  proxyType: string;
} | null;
