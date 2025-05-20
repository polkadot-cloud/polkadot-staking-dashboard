// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { RefObject } from 'react'

export interface UIContextInterface {
  setSideMenu: (v: boolean) => void
  setUserSideMenuMinimised: (v: boolean) => void
  setAdvancedMode: (v: boolean) => void
  setContainerRefs: (
    v: Record<string, RefObject<HTMLDivElement | null>>
  ) => void
  sideMenuOpen: boolean
  userSideMenuMinimised: boolean
  sideMenuMinimised: boolean
  advancedMode: boolean
  containerRefs: Record<string, RefObject<HTMLDivElement | null>>
  isBraveBrowser: boolean
  advancedMode: boolean
  setAdvancedMode: (value: boolean) => void
}
