// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { JoinForm } from './JoinForm';
import type { BondedPool } from 'contexts/Pools/BondedPools/types';

import { PerformanceGraph } from './PerformanceGraph';
import { Stats } from './Stats';
import { Addresses } from './Addresses';
import { Roles } from './Roles';

export const Overview = ({ bondedPool }: { bondedPool: BondedPool }) => (
  <>
    <div className="main">
      <Stats bondedPool={bondedPool} />
      <PerformanceGraph bondedPool={bondedPool} />
      <Addresses bondedPool={bondedPool} />
      <Roles bondedPool={bondedPool} />
    </div>
    <div className="side">
      <div>
        <JoinForm />
      </div>
    </div>
  </>
);
