// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from 'types';

/**
 * @name CanvasCard
 * @summary Modal canvas card wrapper.
 */
export const CanvasCard = ({
  children,
  style,
  className,
}: ComponentBaseWithClassName) => (
  <div
    className={`modal-canvas-card${className ? ` ${className}` : ''}`}
    style={style}
  >
    {children}
  </div>
);
