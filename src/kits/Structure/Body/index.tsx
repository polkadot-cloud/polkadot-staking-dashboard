/* @license Copyright 2024 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import type { ComponentBase } from 'types';
import { Wrapper } from './Wrapper';

/**
 * @name Body
 * @summary An element that houses Side and Main.
 */
export const Body = ({ children, style }: ComponentBase) => (
  <Wrapper style={style}>{children}</Wrapper>
);
