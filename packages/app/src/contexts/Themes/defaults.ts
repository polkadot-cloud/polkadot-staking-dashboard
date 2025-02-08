// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ThemeContextInterface } from './types'

export const defaultThemeContext: ThemeContextInterface = {
  themeElementRef: { current: null },
  toggleTheme: (str) => {},
  mode: 'light',
}
