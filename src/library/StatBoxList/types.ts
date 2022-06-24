// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface NumberProps {
  label: string;
  value: string | number;
  unit: string;
  assistant: any;
  currency?: string;
}

export interface PieProps {
  label: string;
  stat: any;
  graph: any;
  tooltip: any;
  assistant: any;
}

export interface TextProps {
  label: string;
  value: string;
  assistant: any;
}
