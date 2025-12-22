// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faMinus, faPlus, faSignOut } from '@fortawesome/free-solid-svg-icons'
import { Odometer } from '@w3ux/react-odometer'
import { minDecimalPlaces, planckToUnit } from '@w3ux/utils'
import { getChainIcons } from 'assets'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useSyncing } from 'hooks/useSyncing'
import { BondedChart } from 'library/BarChart/BondedChart'
import { ButtonHelpTooltip } from 'library/ButtonHelpTooltip'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary, MultiButton } from 'ui-buttons'
import { ButtonRow, CardHeader, Loader } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'

export const ManageBond = ({ isPreloading }: { isPreloading?: boolean }) => {
	const { t } = useTranslation('pages')

	const { network } = useNetwork()
	const { openHelpTooltip } = useHelp()
	const { openModal } = useOverlay().modal
	const { activeAddress } = useActiveAccounts()
	const { syncing } = useSyncing(['active-pools', 'era-stakers'])
	const { isReadOnlyAccount } = useImportedAccounts()
	const { balances } = useAccountBalances(activeAddress)
	const { isBonding, isMember, activePool, isDepositor } = useActivePool()

	const { units } = getStakingChainData(network)
	const Token = getChainIcons(network).token
	const {
		pool: { active, totalUnlocking, totalUnlocked },
		transferableBalance,
	} = balances
	const { state } = activePool?.bondedPool || {}

	const bondDisabled =
		syncing ||
		!isBonding ||
		!isMember() ||
		isReadOnlyAccount(activeAddress) ||
		state === 'Destroying'
	const canLeavePool = isMember() && !isDepositor() && active > 0n

	return (
		<>
			<CardHeader>
				<h4>
					{t('bondedFunds')}
					<ButtonHelpTooltip
						marginLeft
						definition="Bonded in Pool"
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
						<MultiButton.Container marginRight disabled={bondDisabled}>
							<MultiButton.Button
								size="md"
								disabled={bondDisabled}
								marginRight
								onClick={() =>
									openModal({
										key: 'Bond',
										options: { bondFor: 'pool' },
										size: 'sm',
									})
								}
								iconLeft={faPlus}
								text=""
							/>
							<MultiButton.Button
								size="md"
								disabled={bondDisabled}
								marginRight
								onClick={() =>
									openModal({
										key: 'Unbond',
										options: { bondFor: 'pool' },
										size: 'sm',
									})
								}
								iconLeft={faMinus}
								text=""
							/>
						</MultiButton.Container>
						{canLeavePool && (
							<ButtonPrimary
								size="md"
								text={t('unstake')}
								iconLeft={faSignOut}
								onClick={() => openModal({ key: 'LeavePool', size: 'sm' })}
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
