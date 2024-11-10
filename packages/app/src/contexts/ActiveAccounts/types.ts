// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from 'types';

export interface ActiveAccountsContextInterface {
  activeAccount: MaybeAddress;
  activeProxy: MaybeAddress;
  activeProxyRef: ActiveProxy | null;
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
