// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface StyledSliderProps {
  value: number;
  step: number;
  onChange: (val: number | number[]) => void;
}
