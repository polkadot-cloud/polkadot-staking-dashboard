// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RefObject } from 'react';

export interface PageRowWrapperProps {
  noVerticalSpacer?: boolean;
}

export interface SideInterfaceWrapperProps {
  minimised: number;
  open: number;
}

export interface PageTitleWrapperProps {
  sticky: boolean;
  ref: RefObject<HTMLElement>;
}

export interface InterfaceLayoutProps {
  vOrder: number;
  hOrder: number;
  maxWidth?: string | number;
}
