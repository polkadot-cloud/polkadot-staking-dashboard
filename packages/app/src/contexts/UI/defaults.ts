// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { UIContextInterface } from './types'

export const defaultUIContext: UIContextInterface = {
  setSideMenu: (v) => {},
  setUserSideMenuMinimised: (v) => {},
  setContainerRefs: (v) => {},
  sideMenuOpen: false,
  userSideMenuMinimised: false,
  sideMenuMinimised: false,
  containerRefs: {},
  isBraveBrowser: false,
  advancedMode: false,
  setAdvancedMode: (value) => {},
}
