// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from 'types';

/**
 * @name CanvasContent
 * @summary Modal canvas content wrapper.
 */
export const CanvasContent = ({
  children,
  style,
  className,
}: ComponentBaseWithClassName) => (
  <div
    className={`modal-canvas-content${className ? ` ${className}` : ''}`}
    style={style}
  >
    {children}
  </div>
);
