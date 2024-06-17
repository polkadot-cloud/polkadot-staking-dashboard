// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { RowProps } from '../ButtonRow';
import { appendOrEmpty } from '@w3ux/utils';
import { Wrapper } from './Wrapper';

/**
 * @name PageRow
 * @summary Used to separate page content based on rows. Commonly used with `RowPrimary` and
 * `RowSecondary`.
 */
export const PageRow = ({ children, style, yMargin }: RowProps) => (
  <Wrapper
    className={`page-padding${appendOrEmpty(yMargin, 'y-margin')}`}
    style={style}
  >
    {children}
  </Wrapper>
);
