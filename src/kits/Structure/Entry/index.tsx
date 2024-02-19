/* @license Copyright 2024 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import type { ComponentBase } from 'types';

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
  <div className={`core-entry theme-${mode} theme-${theme}`} style={style}>
    {children}
  </div>
);
