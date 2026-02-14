// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useHelp } from 'contexts/Help'
import { useStaking } from 'contexts/Staking'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useNominatorStats } from 'hooks/useStats'
import { useSyncing } from 'hooks/useSyncing'
import { BondManager } from 'library/BondManager'
import { ButtonHelpTooltip } from 'library/ButtonHelpTooltip'
import { CardWrapper } from 'library/Card/Wrappers'
import { ListStatusHeader } from 'library/List'
import { Nominations } from 'library/Nominations'
import { Stats } from 'library/Stats'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary } from 'ui-buttons'
import { CardHeader, Page, Stat } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { CommissionPrompt } from './CommissionPrompt'
import { Status } from './Status'
import { UnstakePrompts } from './UnstakePrompts'

export const Active = () => {
	const { t } = useTranslation()
	const { syncing } = useSyncing()
	const { isBonding } = useStaking()
	const { openHelpTooltip } = useHelp()
	const { getNominations } = useBalances()
	const { openCanvas } = useOverlay().canvas
	const { formatWithPrefs } = useValidators()
	const { activeAddress } = useActiveAccounts()
	const { activeNominators, minimumNominatorBond, minimumActiveStake } =
		useNominatorStats()

	const nominated = formatWithPrefs(getNominations(activeAddress))
	const ROW_HEIGHT = 220

	return (
		<>
			<Stat.Row>
				<Stats
					items={[activeNominators, minimumNominatorBond, minimumActiveStake]}
				/>
			</Stat.Row>
			<CommissionPrompt />
			<UnstakePrompts />
			<Page.Row>
				<Page.RowSection secondary vLast>
					<CardWrapper height={ROW_HEIGHT}>
						<BondManager bondFor="nominator" />
					</CardWrapper>
				</Page.RowSection>
				<Page.RowSection hLast>
					<Status height={ROW_HEIGHT} />
				</Page.RowSection>
			</Page.Row>
			{isBonding && (
				<Page.Row>
					<CardWrapper>
						{nominated?.length || syncing ? (
							<Nominations bondFor="nominator" nominator={activeAddress} />
						) : (
							<>
								<CardHeader action margin>
									<h3>
										{t('nominate', { ns: 'pages' })}
										<ButtonHelpTooltip
											marginLeft
											definition="Nominations"
											openHelp={openHelpTooltip}
										/>
									</h3>
									<div>
										<ButtonPrimary
											size="md"
											iconLeft={faChevronCircleRight}
											iconTransform="grow-1"
											text={`${t('nominate', { ns: 'pages' })}`}
											disabled={syncing}
											onClick={() =>
												openCanvas({
													key: 'ManageNominations',
													scroll: false,
													options: {
														bondFor: 'nominator',
														nominator: activeAddress,
														nominated,
													},
												})
											}
										/>
									</div>
								</CardHeader>
								<ListStatusHeader>
									{t('notNominating', { ns: 'app' })}.
								</ListStatusHeader>
							</>
						)}
					</CardWrapper>
				</Page.Row>
			)}
		</>
	)
}
