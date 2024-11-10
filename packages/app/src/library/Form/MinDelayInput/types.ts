// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface MinDelayProps {
  initial: number;
  field: string;
  label: string;
  handleChange: (field: string, value: number) => void;
}
