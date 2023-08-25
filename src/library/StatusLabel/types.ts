// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface StatusLabelProps {
  hideIcon?: boolean;
  status: string;
  statusFor?: string;
  title: string;
  topOffset?: string;
  helpKey?: string;
}

export interface WrapperProps {
  $topOffset?: string;
}
