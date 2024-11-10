// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types';
import { Wrapper } from './Wrapper';

/**
 * @name StatBoxRow
 * @summary Used to house a row of `StatBox` items.
 */
export const StatBoxRow = ({ children, style }: ComponentBase) => (
  <Wrapper className="page-padding" style={style}>
    {children}
  </Wrapper>
);
