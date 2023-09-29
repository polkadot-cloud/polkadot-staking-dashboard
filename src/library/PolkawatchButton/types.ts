// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Plugin } from 'types';

export interface StatusLabelProps {
  status: string;
  statusFor?: Plugin;
  title: string;
  topOffset?: string;
}
