// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { Number } from './Number';
import { Pie } from './Pie';
import { Text } from './Text';
import { StatBoxWrapper } from './Wrapper';

export const StatBox = ({ children }: { children: React.ReactNode }) => (
  <StatBoxWrapper
    whileHover={{ scale: 1.02 }}
    transition={{
      duration: 0.5,
      type: 'spring',
      bounce: 0.4,
    }}
  >
    {children}
  </StatBoxWrapper>
);

export const StatBoxListItem = ({ format, params }: any) => {
  switch (format) {
    case 'chart-pie':
      return <Pie {...params} />;

    case 'number':
      return <Number {...params} />;

    case 'text':
      return <Text {...params} />;

    default:
      return null;
  }
};
