// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { Number } from './Number';
import { Pie } from './Pie';
import { Text } from './Text';
import { StatBoxWrapper } from './Wrapper';
import type { AnyJson } from '@polkadot-cloud/react/types';

export const StatBox = ({ children }: { children: ReactNode }) => (
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

export const StatBoxListItem = ({
  format,
  params,
}: {
  format: string;
  params: AnyJson;
}) => {
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
