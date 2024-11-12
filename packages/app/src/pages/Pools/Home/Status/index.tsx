// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActivePool } from 'contexts/Pools/ActivePool';
import { CardWrapper } from 'library/Card/Wrappers';
import { MembershipStatus } from './MembershipStatus';
import { PoolStatus } from './PoolStatus';
import { RewardsStatus } from './RewardsStatus';
import { Separator } from 'ui-structure';
import type { StatusProps } from './types';
import { NewMember } from './NewMember';
import { useSyncing } from 'hooks/useSyncing';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useBalances } from 'contexts/Balances';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';

export const Status = ({ height }: StatusProps) => {
  const { activePool } = useActivePool();
  const { getPoolMembership } = useBalances();
  const { poolMembersipSyncing } = useSyncing();
  const { activeAccount } = useActiveAccounts();
  const { isReadOnlyAccount } = useImportedAccounts();

  const membership = getPoolMembership(activeAccount);
  const syncing = poolMembersipSyncing();

  return (
    <CardWrapper
      height={height}
      className={!syncing && !activePool && !membership ? 'prompt' : undefined}
    >
      <MembershipStatus />
      <Separator />
      <RewardsStatus dimmed={membership === null} />
      {!syncing ? (
        activePool && !!membership ? (
          <>
            <Separator />
            <PoolStatus />
          </>
        ) : (
          membership === null &&
          !isReadOnlyAccount(activeAccount) && <NewMember syncing={syncing} />
        )
      ) : (
        <NewMember syncing={syncing} />
      )}
    </CardWrapper>
  );
};
