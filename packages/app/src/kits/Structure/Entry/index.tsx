// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types';
import { Wrapper } from './Wrapper';

export type EntryProps = ComponentBase & {
  // the theme mode.
  mode: 'light' | 'dark';
  // the active theme.
  theme: string;
};

/**
 * @name Entry
 * @summary The outer-most wrapper that hosts core tag styling.
 */
export const Entry = ({ children, style, mode, theme }: EntryProps) => (
  <Wrapper className={`theme-${mode} theme-${theme}`} style={style}>
    {children}
  </Wrapper>
);
