// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface StyledSliderProps {
  min?: number;
  max?: number;
  value: number;
  step: number;
  classNaame?: string;
  onChange: (val: number | number[]) => void;
}
