// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { CSSProperties } from 'react';
import type { SideProps } from './types';
import classNames from 'classnames';
import classes from './index.module.scss';

/**
 * @name Side
 * @summary An element that houses the side menu and transitions to a toggle-able fixed overlay on
 * smaller screens.
 * @summary Handles maximised and minimised transitions.
 */
export const Side = ({
  children,
  style,
  open,
  minimised,
  width = '20rem',
}: SideProps) => {
  const vars = { '--core-side-width': width } as CSSProperties;

  const classses = classNames(classes.side, {
    [classes.sideHidden]: !open,
    [classes.sideMinimised]: minimised,
  });

  return (
    <div style={{ ...vars, ...style }} className={classses}>
      {children}
    </div>
  );
};
