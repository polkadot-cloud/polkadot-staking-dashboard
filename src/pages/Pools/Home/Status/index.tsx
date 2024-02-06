// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Separator } from '@polkadot-cloud/react';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { CardWrapper } from 'library/Card/Wrappers';
import { MembershipStatus } from './MembershipStatus';
import { PoolStatus } from './PoolStatus';
import { RewardsStatus } from './RewardsStatus';

export const Status = ({ height }: { height: number }) => {
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
