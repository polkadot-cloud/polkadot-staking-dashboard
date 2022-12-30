// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TimeLeftFormatted } from 'library/Hooks/useTimeLeft/types';

export interface NumberProps {
  label: string;
  value: string | number;
  unit: string;
  helpKey: string;
  currency?: string;
}

export interface PieProps {
  label: string;
  stat: {
    value: string | number;
    unit: string | number;
    total?: number;
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

export type TimeLeftRaw = Array<Array<number | string>>;
