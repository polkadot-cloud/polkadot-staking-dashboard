// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useSyncing } from 'hooks/useSyncing'
import { CardWrapper } from 'library/Card/Wrappers'
import { Separator } from 'ui-structure'
import { MembershipStatus } from './MembershipStatus'
import { NewMember } from './NewMember'
import { PoolStatus } from './PoolStatus'
import { RewardsStatus } from './RewardsStatus'
import type { StatusProps } from './types'

export const Status = ({ height }: StatusProps) => {
  const { poolMembersipSyncing } = useSyncing()
  const { activeAccount } = useActiveAccounts()
  const { activePool, inPool } = useActivePool()
  const { isReadOnlyAccount } = useImportedAccounts()

  const syncing = poolMembersipSyncing()

  return (
    <CardWrapper
      height={height}
      className={!syncing && !activePool && !inPool() ? 'prompt' : undefined}
    >
      <MembershipStatus />
      <Separator />
      <RewardsStatus dimmed={inPool() === null} />
      {!syncing ? (
        activePool && inPool() ? (
          <>
            <Separator />
            <PoolStatus />
          </>
        ) : (
          !inPool() &&
          !isReadOnlyAccount(activeAccount) && <NewMember syncing={syncing} />
        )
      ) : (
        <NewMember syncing={syncing} />
      )}
    </CardWrapper>
  )
}
