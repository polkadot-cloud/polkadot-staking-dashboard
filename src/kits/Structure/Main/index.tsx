// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from 'types';
import { Wrapper } from './Wrapper';
import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';

/**
 * @name Main
 * @summary A column flex wrapper that hosts the main page content.
 */
export const Main = forwardRef(
  ({ children, style }: ComponentBase, ref?: ForwardedRef<HTMLDivElement>) => (
    <Wrapper ref={ref} style={style}>
      {children}
    </Wrapper>
  )
);
Main.displayName = 'Main';
