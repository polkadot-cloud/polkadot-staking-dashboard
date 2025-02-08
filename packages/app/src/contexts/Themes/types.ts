// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MutableRefObject } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeContextInterface {
  themeElementRef: MutableRefObject<HTMLDivElement | null>
  toggleTheme: (str?: Theme) => void
  mode: Theme
}
