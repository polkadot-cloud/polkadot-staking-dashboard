// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { JoinForm } from './JoinForm';

import { PerformanceGraph } from './PerformanceGraph';
import { Stats } from './Stats';
import { Addresses } from './Addresses';
import { Roles } from './Roles';
import { GrahpStatsWrapper } from '../Wrappers';
import type { OverviewSectionProps } from '../types';

export const Overview = ({ bondedPool }: OverviewSectionProps) => (
  <>
    <div className="main">
      <GrahpStatsWrapper>
        <Stats bondedPool={bondedPool} />
        <PerformanceGraph bondedPool={bondedPool} />
      </GrahpStatsWrapper>
      <Addresses bondedPool={bondedPool} />
      <Roles bondedPool={bondedPool} />
    </div>
    <div className="side">
      <div>
        <JoinForm bondedPool={bondedPool} />
      </div>
    </div>
  </>
);
