// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useFastUnstake } from 'contexts/FastUnstake'
import { useStaking } from 'contexts/Staking'
import { useNominationStatus } from 'hooks/useNominationStatus'
import { useSyncing } from 'hooks/useSyncing'
import { useUnstaking } from 'hooks/useUnstaking'
import type { UseBondActions } from './types'

export const useBondActions = (): UseBondActions => {
	const { isReady } = useApi()
	const { isBonding } = useStaking()
	const { isFastUnstaking } = useUnstaking()
	const { activeAddress } = useActiveAccounts()
	const { erasToCheckPerBlock } = useFastUnstake()
	const { syncing, accountSynced } = useSyncing([
		'initialization',
		'era-stakers',
	])
	const { isReadOnlyAccount } = useImportedAccounts()
	const { getNominationStatus } = useNominationStatus()
	const { exposed, fastUnstakeStatus } = useFastUnstake()

	const isReadOnly = isReadOnlyAccount(activeAddress)
	const isAccountSynced = accountSynced(activeAddress)
	const isLoading = !isReady || syncing || !isAccountSynced
	const nominationStatus = getNominationStatus(activeAddress, 'nominator')

	// Basic requirements: account must exist, not be read-only, and not be syncing
	const basicRequirements = activeAddress && !isReadOnly && !isLoading

	// Bond actions require basic requirements and bonding capability
	const canBond = Boolean(basicRequirements && !isFastUnstaking)

	// Unbond actions require basic requirements and active bonding
	const canUnbond = Boolean(basicRequirements && isBonding && !isFastUnstaking)

	// Unstake actions require basic requirements and active bonding
	const canUnstake = Boolean(basicRequirements && isBonding)

	// Whether the user can fast unstake
	const canFastUnstake =
		canUnstake &&
		erasToCheckPerBlock > 0 &&
		!nominationStatus.nominees.active.length &&
		fastUnstakeStatus?.status === 'NOT_EXPOSED' &&
		!exposed

	return {
		canBond,
		canUnbond,
		canUnstake,
		canFastUnstake,
	}
}
