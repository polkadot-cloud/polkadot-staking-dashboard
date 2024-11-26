// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames';
import classes from './index.module.scss';
import type { RowSectionProps } from './types';

/**
 * @name RowSection
 * @summary Container for primary and secondary modules in a PageRow.
 */
export const RowSection = ({
  children,
  style,
  vLast,
  hLast,
  secondary,
}: RowSectionProps) => {
  const mainClass = secondary
    ? classes.rowSecondaryWrapper
    : classes.rowPrimaryWrapper;

  let hClass;
  if (secondary) {
    hClass = hLast
      ? classes.rowSecondaryWrapperFirst
      : classes.rowSecondaryWrapperLast;
  } else {
    hClass = hLast
      ? classes.rowPrimaryWrapperFirst
      : classes.rowPrimaryWrapperLast;
  }

  const buttonClasses = classNames(mainClass, hClass, {
    [classes.rowSSectionVLast]: vLast,
  });

  return (
    <div className={buttonClasses} style={style}>
      {children}
    </div>
  );
};
