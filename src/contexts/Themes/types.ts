// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export type Theme = 'light' | 'dark';

export interface ThemeContextInterface {
  toggleTheme: (str?: Theme) => void;
  mode: Theme;
}
