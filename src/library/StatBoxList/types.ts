// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TimeLeftFormatted } from 'library/Hooks/useTimeLeft/types';

export interface NumberProps {
  label: string;
  value: number;
  decimals?: number;
  unit: string;
  helpKey: string;
}

export interface PieProps {
  label: string;
  stat: {
    value: string | number;
    unit: string | number;
    total?: string | number;
  };
  graph: {
    value1: number;
    value2: number;
  };
  tooltip?: string;
  helpKey: string;
}

export interface TextProps {
  primary?: boolean;
  label: string;
  value: string;
  secondaryValue?: string;
  helpKey: string;
}

export interface TimeleftProps {
  label: string;
  timeleft: TimeLeftFormatted;
  graph: {
    value1: number;
    value2: number;
  };
  tooltip?: string;
  helpKey: string;
}

export type TimeLeftRaw = TimeLeftRawItem[];
export type TimeLeftRawItem = Array<number | string>;
