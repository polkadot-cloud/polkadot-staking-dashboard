// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTimeLeft } from '@w3ux/hooks'
import { secondsFromNow } from '@w3ux/hooks/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { useTheme } from 'contexts/Themes'
import { fromUnixTime, getUnixTime } from 'date-fns'
import { useActiveAccountPool } from 'hooks/useActiveAccountPool'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { useEraTimeLeft } from 'hooks/useEraTimeLeft'
import { useNominationStatus } from 'hooks/useNominationStatus'
import { useSyncing } from 'hooks/useSyncing'
import { useTips } from 'hooks/useTips'
import { Countdown } from 'library/Countdown'
import { Stat } from 'library/Stat'
import { Preloader } from 'library/StatusPreloader/Preloader'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import SimpleBar from 'simplebar-react'
import {
	ButtonRow,
	Countdown as CountdownWrapper,
	Page,
	Tooltip,
} from 'ui-core/base'
import { Tips } from 'ui-tips'
import { formatTimeleft } from 'utils'
import type { WarningMessage } from '../types'
import { SectionWrapper, StatItem } from '../Wrappers'

export const Status = ({
	warningMessages,
}: {
	warningMessages: WarningMessage[]
}) => {
	const { i18n, t } = useTranslation()
	const { activeEra } = useApi()
	const { network } = useNetwork()
	const { syncing } = useSyncing()
	const { isBonding } = useStaking()
	const { themeElementRef } = useTheme()
	const { activeAddress } = useActiveAccounts()
	const { items, getPoolWarningTips } = useTips()
	const { getNominationStatus } = useNominationStatus()
	const { inPool, activePool, membershipDisplay, label } =
		useActiveAccountPool()
	const { getAverageRewardRate, formatRateAsPercent } = useAverageRewardRate()

	const poolWarningTips = getPoolWarningTips()
	const nominationStatus = getNominationStatus(activeAddress, 'nominator')

	const { get: getEraTimeleft } = useEraTimeLeft()
	const { timeleft, setFromNow } = useTimeLeft({
		depsTimeleft: [network],
		depsFormat: [i18n.resolvedLanguage],
	})

	const timeleftResult = getEraTimeleft()
	const formatted = formatTimeleft(t, timeleft.raw, { forceShowSeconds: true })
	const dateFrom = fromUnixTime(Date.now() / 1000)
	const dateTo = secondsFromNow(timeleftResult.timeleft)

	// Reset timer on era change (also covers network change)
	useEffect(() => {
		setFromNow(dateFrom, dateTo)
	}, [activeEra, getUnixTime(dateTo)])

	const Status = isBonding ? (
		<Stat
			label={t('status', { ns: 'pages' })}
			stat={
				inPool ? t('alreadyInPool', { ns: 'pages' }) : nominationStatus.message
			}
		/>
	) : activePool ? (
		<Stat
			label={label}
			type="address"
			stat={{
				address: activePool?.addresses?.stash ?? '',
				display: membershipDisplay,
			}}
		/>
	) : !activeAddress ? (
		<Stat label={''} stat={t('noAccountSelected', { ns: 'app' })} />
	) : (
		<Stat label={''} stat={t('notStaking', { ns: 'pages' })} />
	)

	return (
		<SectionWrapper>
			<div className="content top hPadding vPadding">
				<Page.RowSection standalone={true} style={{ width: '100%' }}>
					<section>
						{syncing ? (
							<Preloader />
						) : (
							<>
								{Status}
								<div
									style={{
										position: 'relative',
										width: '100%',
									}}
								>
									<div
										style={{
											position: 'absolute',
											width: '100%',
											left: 0,
										}}
									>
										<SimpleBar autoHide={false} className="thin-scrollbar">
											<ButtonRow
												yMargin
												style={{
													padding: isBonding ? undefined : '0 0.5rem',
													flexWrap: 'nowrap',
												}}
											>
												{warningMessages.map(
													({ value, label, format, description, faIcon }) => (
														<StatItem className={`${format}`} key={value}>
															<Tooltip
																text={description}
																side="bottom"
																container={themeElementRef.current || undefined}
																delayDuration={400}
																fadeIn
															>
																<div className={`inner withTooltip ${format}`}>
																	<CountdownWrapper variant={format}>
																		<FontAwesomeIcon icon={faIcon} />
																		{value}
																		{label && <span>{label}</span>}
																	</CountdownWrapper>
																</div>
															</Tooltip>
														</StatItem>
													),
												)}
												{warningMessages.length === 0 && (
													<>
														<StatItem>
															<div className="inner">
																<CountdownWrapper variant="secondary">
																	{formatRateAsPercent(getAverageRewardRate())}
																	<span>APY</span>
																</CountdownWrapper>
															</div>
														</StatItem>
														<StatItem>
															<div className="inner">
																{t('nextRewardsIn', { ns: 'app' })}
																<CountdownWrapper variant="secondary">
																	<Countdown timeleft={formatted} />
																</CountdownWrapper>
															</div>
														</StatItem>
													</>
												)}
											</ButtonRow>
										</SimpleBar>
									</div>
								</div>
							</>
						)}
					</section>
				</Page.RowSection>
			</div>
			<Tips
				items={warningMessages.length ? poolWarningTips : items}
				syncing={syncing}
				onPageReset={{ network, activeAddress }}
			/>
		</SectionWrapper>
	)
}
