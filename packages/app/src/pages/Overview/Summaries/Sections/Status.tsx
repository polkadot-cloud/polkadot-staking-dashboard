// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTimeLeft } from '@w3ux/hooks'
import { secondsFromNow } from '@w3ux/hooks/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { fromUnixTime, getUnixTime } from 'date-fns'
import { useActiveAccountPool } from 'hooks/useActiveAccountPool'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { useEraTimeLeft } from 'hooks/useEraTimeLeft'
import { useNominationStatus } from 'hooks/useNominationStatus'
import { useSyncing } from 'hooks/useSyncing'
import { useTips } from 'hooks/useTips'
import { useWarnings } from 'hooks/useWarnings'
import { Countdown } from 'library/Countdown'
import { Stat } from 'library/Stat'
import { Preloader } from 'library/StatusPreloader/Preloader'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import SimpleBar from 'simplebar-react'
import { Badge, ButtonRow, Page } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { Tips } from 'ui-tips'
import { formatTimeleft } from 'utils'
import { SectionWrapper, Subheading } from '../Wrappers'

export const Status = () => {
	const { i18n, t } = useTranslation()
	const { activeEra } = useApi()
	const { network } = useNetwork()
	const { isBonding } = useStaking()
	const { accountSynced } = useSyncing()
	const { openModal } = useOverlay().modal
	const { warningMessages } = useWarnings()
	const { activeAddress } = useActiveAccounts()
	const { items, getPoolWarningTips } = useTips()
	const { getNominationStatus } = useNominationStatus()
	const { inPool, activePool, membershipDisplay, label } =
		useActiveAccountPool()
	const { getAverageRewardRate, formatRateAsPercent } = useAverageRewardRate()

	const syncing = !accountSynced(activeAddress)
	const poolWarningTips = getPoolWarningTips()
	const nominationStatus = getNominationStatus(activeAddress, 'nominator')
	const notStaking = activeAddress && !isBonding && !inPool

	const { get: getEraTimeleft } = useEraTimeLeft()
	const { timeleft, setFromNow } = useTimeLeft({
		depsTimeleft: [network],
		depsFormat: [i18n.resolvedLanguage],
	})

	const timeleftResult = getEraTimeleft()
	const formatted = formatTimeleft(t, timeleft.raw, { forceShowSeconds: true })
	const dateFrom = fromUnixTime(Date.now() / 1000)
	const dateTo = secondsFromNow(timeleftResult.timeleft)

	// Memoize the tips items to avoid recalculation
	const tipsItems = useMemo(
		() => (warningMessages.length ? poolWarningTips : items),
		[warningMessages.length, poolWarningTips, items],
	)

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
								{notStaking && (
									<Subheading>{t('stakingStats', { ns: 'app' })}</Subheading>
								)}
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
												style={{
													padding: isBonding ? undefined : '0 0.5rem',
													flexWrap: 'nowrap',
												}}
											>
												{!activeAddress ? (
													<Badge.Container hList format="button">
														<Badge.Inner>
															<button
																type="button"
																onClick={() => openModal({ key: 'Accounts' })}
															>
																{t('selectAccount', { ns: 'app' })}
																<FontAwesomeIcon
																	icon={faChevronRight}
																	transform="shrink-4"
																/>
															</button>
														</Badge.Inner>
													</Badge.Container>
												) : (
													<>
														{warningMessages.map(
															({ value, label, format, faIcon }) => (
																<Badge.Container format={format} hList styled>
																	<Badge.Inner variant={format}>
																		<FontAwesomeIcon icon={faIcon} />
																		{value}
																		{label && <span>{label}</span>}
																	</Badge.Inner>
																</Badge.Container>
															),
														)}
														{warningMessages.length === 0 && (
															<>
																<Badge.Container hList>
																	<Badge.Inner variant="secondary">
																		{formatRateAsPercent(
																			getAverageRewardRate(),
																		)}
																		<span>APY</span>
																	</Badge.Inner>
																</Badge.Container>
																<Badge.Container hList>
																	{t('nextRewardsIn', { ns: 'app' })}
																	<Badge.Inner variant="secondary">
																		<Countdown timeleft={formatted} />
																	</Badge.Inner>
																</Badge.Container>
															</>
														)}
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
				items={tipsItems}
				syncing={syncing}
				onPageReset={{ network, activeAddress }}
			/>
		</SectionWrapper>
	)
}
