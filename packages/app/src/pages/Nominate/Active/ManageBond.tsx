// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
	faBolt,
	faMinus,
	faPlus,
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
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useBondActions } from 'hooks/useBondActions'
import { useUnstaking } from 'hooks/useUnstaking'
import { BondedChart } from 'library/BarChart/BondedChart'
import { ButtonHelpTooltip } from 'library/ButtonHelpTooltip'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary, MultiButton } from 'ui-buttons'
import { ButtonRow, CardHeader } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'

export const ManageBond = () => {
	const { t } = useTranslation('pages')
	const { network } = useNetwork()
	const { openHelpTooltip } = useHelp()
	const { openModal } = useOverlay().modal
	const { getStakingLedger } = useBalances()
	const { activeAddress } = useActiveAccounts()
	const { getFastUnstakeText } = useUnstaking()
	const { isReadOnlyAccount } = useImportedAccounts()
	const { balances } = useAccountBalances(activeAddress)
	const { canBond, canUnbond, canUnstake, canFastUnstake } = useBondActions()

	const { ledger } = getStakingLedger(activeAddress)
	const { units } = getStakingChainData(network)
	const Token = getChainIcons(network).token
	const active = ledger?.active || 0n

	const { totalUnlocking, totalUnlocked } = balances.nominator

	// The available unstake buttons to display. If fast unstaking is available the fast unstake
	// button will be displayed. Otherwise show the normal unstake button. If the account is
	// read-only, no buttons will be displayed.
	const unstakeButtons = !isReadOnlyAccount(activeAddress) ? (
		canFastUnstake ? (
			<ButtonPrimary
				size="md"
				text={getFastUnstakeText()}
				iconLeft={faBolt}
				onClick={() => {
					openModal({ key: 'ManageFastUnstake', size: 'sm' })
				}}
			/>
		) : (
			<ButtonPrimary
				size="md"
				text={t('unstake')}
				iconLeft={faSignOutAlt}
				disabled={!canUnstake}
				onClick={() => openModal({ key: 'Unstake', size: 'sm' })}
			/>
		)
	) : null

	return (
		<>
			<CardHeader>
				<h4>
					{t('bondedFunds')}
					<ButtonHelpTooltip
						marginLeft
						definition="Bonding"
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
				<ButtonRow>
					<MultiButton.Container marginRight disabled={!canBond && !canUnbond}>
						<MultiButton.Button
							size="md"
							disabled={!canBond}
							marginRight
							onClick={() =>
								openModal({
									key: 'Bond',
									options: { bondFor: 'nominator' },
									size: 'sm',
								})
							}
							iconLeft={faPlus}
							text=""
						/>
						<span />
						<MultiButton.Button
							size="md"
							disabled={!canUnbond}
							marginRight
							onClick={() =>
								openModal({
									key: 'Unbond',
									options: { bondFor: 'nominator' },
									size: 'sm',
								})
							}
							iconLeft={faMinus}
							text=""
						/>
					</MultiButton.Container>
					{unstakeButtons}
				</ButtonRow>
			</CardHeader>
			<BondedChart
				active={new BigNumber(planckToUnit(active, units))}
				unlocking={new BigNumber(planckToUnit(totalUnlocking, units))}
				unlocked={new BigNumber(planckToUnit(totalUnlocked, units))}
				free={new BigNumber(planckToUnit(balances.transferableBalance, units))}
				inactive={active === 0n}
			/>
		</>
	)
}
