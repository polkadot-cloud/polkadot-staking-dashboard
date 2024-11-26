// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames';
import type { RowProps } from '../types';
import classes from './index.module.scss';

/**
 * @name PageRow
 * @summary Used to separate page content based on rows. Commonly used with `RowPrimary` and
 * `RowSecondary`.
 */
export const PageRow = ({ children, style, yMargin }: RowProps) => {
  const buttonClasses = classNames(classes.pageRow, 'page-padding', {
    [classes.pageRowYMargin]: yMargin,
  });

  return (
    <div className={buttonClasses} style={style}>
      {children}
    </div>
  );
};
