// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface ItemProps {
  text: string;
  ctaText?: string;
  onClick?: () => void;
  leftIcon?: {
    show: boolean;
    status: 'active' | 'inactive' | 'off';
  };
}
