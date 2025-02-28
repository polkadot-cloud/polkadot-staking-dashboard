// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from 'types';
import { Wrapper } from './Wrapper';

export type RowProps = ComponentBase & {
  // whether there is margin space vertically.
  yMargin?: boolean;
};

/**
 * @name ButtonRow
 * @summary A flex container for a row of buttons.
 */
export const ButtonRow = ({ children, style, yMargin }: RowProps) => (
  <Wrapper className={yMargin ? 'y-margin' : undefined} style={style}>
    {children}
  </Wrapper>
);
