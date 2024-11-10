// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface HeaderProps {
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
