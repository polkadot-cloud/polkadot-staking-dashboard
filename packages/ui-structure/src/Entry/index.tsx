// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types';
import classes from './index.module.scss';

export type EntryProps = ComponentBase & {
  mode: 'light' | 'dark';
  theme: string;
};

/**
 * @name Entry
 * @summary The outer-most wrapper that hosts core tag styling.
 */
export const Entry = ({ children, style, mode, theme }: EntryProps) => (
  <div
    className={`${classes.entry} theme-${mode} theme-${theme}`}
    style={style}
  >
    {children}
  </div>
);
