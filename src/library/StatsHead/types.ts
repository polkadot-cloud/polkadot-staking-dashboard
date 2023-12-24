// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface StatsHeadProps {
  items: PoolStatLabel[];
}

export interface PoolStatLabel {
  label: string;
  value: string;
  button?: {
    text: string;
    onClick: () => void;
    disabled: boolean;
  };
  helpKey?: string;
}
