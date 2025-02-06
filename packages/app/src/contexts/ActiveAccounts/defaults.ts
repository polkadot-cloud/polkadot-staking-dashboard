// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ActiveAccountsContextInterface } from './types'

export const defaultActiveAccountsContext: ActiveAccountsContextInterface = {
  activeAccount: null,
  activeProxy: null,
  activeProxyRef: null,
  activeProxyType: null,
  getActiveAccount: () => null,
  setActiveAccount: (address, updateLocal) => {},
  setActiveProxy: (address, updateLocal) => {},
}
