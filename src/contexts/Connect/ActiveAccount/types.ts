// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAccount } from 'types';
import type { ActiveProxy } from '../types';

export interface ActiveAccountContextInterface {
  activeAccount: MaybeAccount;
  activeProxy: MaybeAccount;
  activeProxyType: string | null;
  getActiveAccount: () => string | null;
  setActiveAccount: (a: MaybeAccount) => void;
  setActiveProxy: (p: ActiveProxy, l?: boolean) => void;
}
