// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useStaking } from 'contexts/Staking'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useNominationStatus } from '../useNominationStatus'

export const useUnstaking = () => {
	const { isNominator } = useStaking()
	const { activeAddress } = useActiveAccounts()
	const { getNominationStatus } = useNominationStatus()

	const {
		balances: {
			nominator: { active },
		},
	} = useAccountBalances(activeAddress)
	const { nominees } = getNominationStatus(activeAddress, 'nominator')

	return {
		isUnstaking: isNominator && !nominees.active.length && active === 0n,
	}
}
