// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
	faMinus,
	faPlus,
	faSignOut,
	faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons'
import { Odometer } from '@w3ux/react-odometer'
import { minDecimalPlaces, planckToUnit } from '@w3ux/utils'
import { getChainIcons } from 'assets'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useBondActions } from 'hooks/useBondActions'
import { useSyncing } from 'hooks/useSyncing'
import { BondedChart } from 'library/BarChart/BondedChart'
import { ButtonHelpTooltip } from 'library/ButtonHelpTooltip'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary, MultiButton } from 'ui-buttons'
import { ButtonRow, CardHeader, Loader } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import type { BondManagerProps } from './types'

export const BondManager = ({ bondFor, isPreloading }: BondManagerProps) => {
	const { t } = useTranslation('pages')
	const { network } = useNetwork()
	const { openHelpTooltip } = useHelp()
	const { openModal } = useOverlay().modal
	const { activeAddress } = useActiveAccounts()
	const { isReadOnlyAccount } = useImportedAccounts()
	const { balances } = useAccountBalances(activeAddress)

	// Nominator-specific hooks
	const { getStakingLedger } = useBalances()
	const { canBond, canUnbond, canUnstake } = useBondActions()

	// Pool-specific hooks
	const { syncing } = useSyncing(['active-pools', 'era-stakers'])
	const { isBonding, isMember, activePool, isDepositor } = useActivePool()

	const { units } = getStakingChainData(network)
	const Token = getChainIcons(network).token

	const isNominator = bondFor === 'nominator'

	// Get active balance based on bond type
	const { ledger } = getStakingLedger(activeAddress)
	const nominatorActive = ledger?.active || 0n
	const poolActive = balances.pool.active

	const active = isNominator ? nominatorActive : poolActive

	// Get unlocking/unlocked balances based on bond type
	const { totalUnlocking, totalUnlocked } = isNominator
		? balances.nominator
		: balances.pool

	const transferableBalance = balances.transferableBalance

	// Determine disabled state for bond/unbond buttons
	const { state } = activePool?.bondedPool || {}
	const poolBondDisabled =
		syncing ||
		!isBonding ||
		!isMember() ||
		isReadOnlyAccount(activeAddress) ||
		state === 'Destroying'

	const nominatorBondDisabled = !canBond && !canUnbond

	const bondButtonsDisabled = isNominator
		? nominatorBondDisabled
		: poolBondDisabled

	// Individual button disabled states
	const bondDisabled = isNominator ? !canBond : poolBondDisabled
	const unbondDisabled = isNominator ? !canUnbond : poolBondDisabled

	// Unstake button logic
	const canLeavePool = isMember() && !isDepositor() && poolActive > 0n
	const showUnstakeButton = isNominator
		? !isReadOnlyAccount(activeAddress)
		: canLeavePool

	const unstakeDisabled = isNominator ? !canUnstake : false
	const unstakeModalKey = isNominator ? 'Unstake' : 'LeavePool'
	const unstakeIcon = isNominator ? faSignOutAlt : faSignOut

	// Help key based on bond type
	const helpKey = isNominator ? 'Bonding' : 'Bonded in Pool'

	return (
		<>
			<CardHeader>
				<h4>
					{t('bondedFunds')}
					<ButtonHelpTooltip
						marginLeft
						definition={helpKey}
						openHelp={openHelpTooltip}
					/>
				</h4>
				<h2>
					<Token />
					<Odometer
						value={minDecimalPlaces(
							new BigNumber(planckToUnit(active, units)).toFormat(),
							2,
						)}
						zeroDecimals={2}
					/>
				</h2>
				{isPreloading ? (
					<Loader style={{ height: '2.5rem', width: '10rem' }} />
				) : (
					<ButtonRow>
						<MultiButton.Container marginRight disabled={bondButtonsDisabled}>
							<MultiButton.Button
								size="md"
								disabled={bondDisabled}
								marginRight
								onClick={() =>
									openModal({
										key: 'Bond',
										options: { bondFor },
										size: 'sm',
									})
								}
								iconLeft={faPlus}
								text=""
							/>
							{isNominator && <span />}
							<MultiButton.Button
								size="md"
								disabled={unbondDisabled}
								marginRight
								onClick={() =>
									openModal({
										key: 'Unbond',
										options: { bondFor },
										size: 'sm',
									})
								}
								iconLeft={faMinus}
								text=""
							/>
						</MultiButton.Container>
						{showUnstakeButton && (
							<ButtonPrimary
								size="md"
								text={t('unstake')}
								iconLeft={unstakeIcon}
								disabled={unstakeDisabled}
								onClick={() => openModal({ key: unstakeModalKey, size: 'sm' })}
							/>
						)}
					</ButtonRow>
				)}
			</CardHeader>
			<BondedChart
				active={new BigNumber(planckToUnit(active, units))}
				unlocking={new BigNumber(planckToUnit(totalUnlocking, units))}
				unlocked={new BigNumber(planckToUnit(totalUnlocked, units))}
				free={new BigNumber(planckToUnit(transferableBalance, units))}
				inactive={active === 0n}
			/>
		</>
	)
}
