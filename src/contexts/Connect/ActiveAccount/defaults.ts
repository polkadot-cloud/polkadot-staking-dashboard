// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ActiveAccountContextInterface } from './types';

export const defaultActiveAccountContext: ActiveAccountContextInterface = {
  activeAccount: null,
  activeProxy: null,
  activeProxyType: null,
  getActiveAccount: () => null,
  setActiveAccount: (a) => {},
  setActiveProxy: (p, l) => {},
};
