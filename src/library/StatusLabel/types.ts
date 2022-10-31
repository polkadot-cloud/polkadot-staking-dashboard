// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface StatusLabelProps {
  hideIcon?: boolean;
  status: string;
  statusFor?: string;
  title: string;
  topOffset?: string;
  helpKey?: string;
}

export interface WrapperProps {
  topOffset?: string;
}
