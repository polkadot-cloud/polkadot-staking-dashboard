// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classes from './index.module.scss';
import type { ComponentBase } from '@w3ux/types';

/**
 * @name Page
 * @summary Page heading container.
 */
export const PageHeading = ({ children, style }: ComponentBase) => (
  <div className={classes.pageHeading} style={style}>
    {children}
  </div>
);
