// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useSyncing } from 'hooks/useSyncing'
import { CardWrapper } from 'library/Card/Wrappers'
import { StatusPreloader } from 'library/StatusPreloader'
import { Separator } from 'ui-core/base'
import { MembershipStatus } from './MembershipStatus'
import { NewMember } from './NewMember'
import { PoolStatus } from './PoolStatus'
import { RewardsStatus } from './RewardsStatus'
import type { StatusProps } from './types'

export const Status = ({
	height,
	isPreloading,
	showOtherOptions,
}: StatusProps) => {
	const { getPoolStatusSynced } = useSyncing()
	const { activeAddress } = useActiveAccounts()
	const { activePool, inPool } = useActivePool()
	const { isReadOnlyAccount } = useImportedAccounts()

	const syncing = !getPoolStatusSynced()

	if (isPreloading) {
		return <StatusPreloader height={height} />
	}

	return (
		<CardWrapper
			height={height}
			className={!syncing && !activePool && !inPool ? 'prompt' : undefined}
		>
			<MembershipStatus />
			<Separator />
			<RewardsStatus dimmed={inPool === null} />
			{!syncing && activePool && inPool && (
				<>
					<Separator />
					<PoolStatus />
				</>
			)}
			{(syncing || (!inPool && !isReadOnlyAccount(activeAddress))) && (
				<NewMember syncing={syncing} showOtherOptions={showOtherOptions} />
			)}
		</CardWrapper>
	)
}
