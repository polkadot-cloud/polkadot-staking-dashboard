// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyJson } from 'types';

const v = (light: string, dark: string) => ({
  light,
  dark,
});

export const graphColors: { [key: string]: AnyJson } = {
  graphs: {
    border: v('#ccc', '#444'),
    inactive: v('#f2f1f0', '#1d1d1d'),
    tooltip: v('#333', '#ddd'),
    label: v('#fafafa', '#0e0e0e'),
    grid: v('#e8e8e8', '#222'),
  },
};
