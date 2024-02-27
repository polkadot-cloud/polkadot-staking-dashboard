// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';
import type { ModalFixedTitleProps } from '../types';
import { appendOrEmpty } from '@w3ux/utils';

/**
 * @name ModalFixedTitle
 * @summary Fixed the title.
 */
export const ModalFixedTitle = forwardRef(
  (
    { children, style, withStyle }: ModalFixedTitleProps,
    ref?: ForwardedRef<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={`modal-fixed-title${appendOrEmpty(withStyle, 'with-style')}`}
      style={style}
    >
      {children}
    </div>
  )
);
ModalFixedTitle.displayName = 'ModalFixedTitle';
