// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Number } from './Number';
import { Pie } from './Pie';
import { Text } from './Text';
import { StatBoxWrapper } from './Wrapper';

export const StatBox = ({ children }: { children: React.ReactNode }) => {
  return (
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
};

const StatBoxListItem = ({ format, params }: any) => {
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

export default StatBoxListItem;
