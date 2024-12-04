// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MutableRefObject } from 'react'

export interface UIContextInterface {
  setSideMenu: (v: boolean) => void
  setUserSideMenuMinimised: (v: boolean) => void
  setContainerRefs: (
    v: Record<string, MutableRefObject<HTMLDivElement | null>>
  ) => void
  sideMenuOpen: boolean
  userSideMenuMinimised: boolean
  sideMenuMinimised: boolean
  containerRefs: Record<string, MutableRefObject<HTMLDivElement | null>>
  isBraveBrowser: boolean
}
