// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface NumberProps {
  label: string;
  value: string | number;
  unit: string;
  helpKey: string;
  chelpKey: string;
  currency?: string;
}

export interface PieProps {
  label: string;
  stat: any;
  graph: any;
  tooltip: any;
  helpKey: string;
  chelpKey: string;
}

export interface TextProps {
  label: string;
  value: string;
  helpKey: string;
  chelpKey: string;
}
