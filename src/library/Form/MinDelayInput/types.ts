// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface MinDelayProps {
  initial: number;
  field: string;
  label: string;
  handleChange: (field: string, value: number) => void;
}
