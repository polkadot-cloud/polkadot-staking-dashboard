// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SetupType } from 'contexts/UI/types';

export interface HeaderProps {
  title?: string;
  assistantPage?: string;
  assistantKey?: string;
  complete?: boolean | null;
  thisSection: number;
  setupType: SetupType;
}

export interface FooterProps {
  complete: boolean;
  setupType: SetupType;
}
