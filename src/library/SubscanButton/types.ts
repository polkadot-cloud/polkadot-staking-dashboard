// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface StatusLabelProps {
  status: string;
  statusFor?: string;
  title: string;
  topOffset?: string;
}

export interface WrapperProps {
  color: string;
  opacity: number;
}
