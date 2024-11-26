// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBaseWithClassName } from '@w3ux/types';
import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';

/**
 * @name ModalCard
 * @summary Modal card wrapper.
 */
export const ModalCard = forwardRef(
  (
    { children, style, className }: ComponentBaseWithClassName,
    ref?: ForwardedRef<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={`modal-card${className ? ` ${className}` : ''}`}
      style={style}
    >
      {children}
    </div>
  )
);
ModalCard.displayName = 'ModalCard';
