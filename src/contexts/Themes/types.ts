// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type Theme = 'light' | 'dark';

export interface ThemeContextInterface {
  toggleTheme: (str?: Theme) => void;
  mode: Theme;
}
