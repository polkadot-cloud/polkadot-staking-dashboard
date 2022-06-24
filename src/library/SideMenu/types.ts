// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface HeadingProps {
  title: string;
  minimised: boolean;
}

export interface ItemProps {
  name: string;
  active: boolean;
  to: string;
  icon: any;
  action: boolean;
  minimised: boolean;
}
