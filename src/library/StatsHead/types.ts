// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface StatsHeadProps {
  items: {
    value: string;
    label: string;
    helpKey?: string;
  }[];
}
