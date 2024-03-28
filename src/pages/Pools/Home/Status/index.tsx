// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActivePool } from 'contexts/Pools/ActivePool';
import { CardWrapper } from 'library/Card/Wrappers';
import { MembershipStatus } from './MembershipStatus';
import { PoolStatus } from './PoolStatus';
import { RewardsStatus } from './RewardsStatus';
import { Separator } from 'kits/Structure/Separator';
import type { StatusProps } from './types';

export const Status = ({ height }: StatusProps) => {
  const { activePool } = useActivePool();

  return (
    <CardWrapper height={height}>
      <MembershipStatus />
      <Separator />
      <RewardsStatus />
      {activePool && (
        <>
          <Separator />
          <PoolStatus />
        </>
      )}
    </CardWrapper>
  );
};
