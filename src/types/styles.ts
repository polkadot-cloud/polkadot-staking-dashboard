// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RefObject } from 'react';

export interface PageTitleWrapperProps {
  sticky: boolean;
  ref: RefObject<HTMLElement>;
}

export interface InterfaceLayoutProps {
  vOrder: number;
  hOrder: number;
  maxWidth?: string | number;
  thresholdStickyMenu: number;
  thresholdFullWidth: number;
}
