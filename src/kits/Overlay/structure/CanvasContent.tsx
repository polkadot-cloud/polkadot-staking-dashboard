/* @license Copyright 2024 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import type { ComponentBaseWithClassName } from '@polkadot-cloud/react/types';

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
