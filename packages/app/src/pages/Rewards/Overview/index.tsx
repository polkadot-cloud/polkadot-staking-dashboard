// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Odometer } from '@w3ux/react-odometer'
import { minDecimalPlaces } from '@w3ux/utils'
import { getChainIcons } from 'assets'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useCurrency } from 'contexts/Currency'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useTokenPrices } from 'contexts/TokenPrice'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { useEnhancedRewardRate } from 'hooks/useEnhancedRewardRate'
import { Balance } from 'library/Balance'
import { CardWrapper } from 'library/Card/Wrappers'
import { formatFiatCurrency } from 'locales/util'
import { AverageRewardRate } from 'pages/Overview/Stats/AverageRewardRate'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	CardHeader,
	CardLabel,
	Page,
	RewardGrid,
	Separator,
	Stat,
} from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { RewardCalculator } from '../Stats/RewardCalculator'
import { RewardTrend } from '../Stats/RewardTrend'
import type { PayoutHistoryProps } from '../types'
import { RecentPayouts } from './RecentPayouts'

export const Overview = (props: PayoutHistoryProps) => {
	const { t } = useTranslation('pages')
	const { network } = useNetwork()
	const { currency } = useCurrency()
	const { pluginEnabled } = usePlugins()
	const { openModal } = useOverlay().modal
	const { avgCommission } = useValidators()
	const { activeAddress } = useActiveAccounts()
	const { price: tokenPrice } = useTokenPrices()
	const { getAverageRewardRate } = useAverageRewardRate()
	const { calculateAnnualRewardWithActualCommission, getActualCommissionRate } =
		useEnhancedRewardRate()
	const { stakedBalance } = useAccountBalances(activeAddress)

	const { unit } = getStakingChainData(network)
	const Token = getChainIcons(network).token

	// Calculation mode: 'simple', 'enhanced', 'conservative'
	const [calculationMode, setCalculationMode] = useState<
		'simple' | 'enhanced' | 'conservative'
	>('conservative')

	const currentStake = stakedBalance.toNumber()

	// Calculate rewards based on selected mode
	const getRewardCalculations = () => {
		const actualCommissionRate = getActualCommissionRate()

		switch (calculationMode) {
			case 'simple': {
				// Original simple calculation
				const annualRewardBase =
					currentStake * (getAverageRewardRate() / 100) || 0
				const annualRewardAfterCommission =
					annualRewardBase * (1 - avgCommission / 100)
				return {
					annual: annualRewardAfterCommission,
					monthly: annualRewardAfterCommission / 12,
					daily: annualRewardAfterCommission / 365,
					commissionRate: avgCommission,
					description: t('simpleCalculationDesc'),
				}
			}
			case 'enhanced': {
				// Enhanced with era points but optimistic
				const enhancedRewards = calculateAnnualRewardWithActualCommission(
					currentStake,
					false,
				)
				return {
					annual: enhancedRewards.afterCommission,
					monthly: enhancedRewards.afterCommission / 12,
					daily: enhancedRewards.afterCommission / 365,
					commissionRate: actualCommissionRate,
					description: t('enhancedCalculationDesc'),
				}
			}
			case 'conservative':
			default: {
				// Enhanced with conservative adjustment (most accurate)
				const enhancedRewards = calculateAnnualRewardWithActualCommission(
					currentStake,
					true,
				)
				return {
					annual: enhancedRewards.afterCommission,
					monthly: enhancedRewards.afterCommission / 12,
					daily: enhancedRewards.afterCommission / 365,
					commissionRate: actualCommissionRate,
					description: t('conservativeCalculationDesc'),
				}
			}
		}
	}

	const calculations = getRewardCalculations()
	const {
		annual: annualReward,
		monthly: monthlyReward,
		daily: dailyReward,
	} = calculations

	// Format the currency with user's locale and currency preference
	const formatLocalCurrency = (value: number) =>
		formatFiatCurrency(value, currency)

	return (
		<>
			<Stat.Row>
				<AverageRewardRate />
				{pluginEnabled('staking_api') && <RewardTrend />}
				<RewardCalculator
					onClick={() => {
						openModal({
							key: 'RewardCalculator',
							size: 'xs',
							options: {
								currency,
							},
						})
					}}
				/>
			</Stat.Row>
			<Page.Row>
				<CardWrapper>
					<RecentPayouts {...props} />
				</CardWrapper>
			</Page.Row>
			{pluginEnabled('staking_api') && (
				<Page.Row>
					<CardWrapper>
						<CardHeader>
							<h3>{t('projectedRewards')}</h3>
						</CardHeader>
						<Separator style={{ margin: '0 0 1.5rem 0', border: 0 }} />
						<CardHeader>
							<h4>{t('stakedBalance')}</h4>
							<h2>
								<Token />
								<Odometer
									value={minDecimalPlaces(
										new BigNumber(currentStake).toFormat(),
										2,
									)}
									zeroDecimals={2}
								/>
								<CardLabel>
									<Balance.Value
										tokenBalance={currentStake}
										currency={currency}
									/>
								</CardLabel>
							</h2>
						</CardHeader>
						<Separator />
						<div style={{ padding: '0.5rem 1rem' }}>
							<h4 style={{ marginBottom: '0.75rem' }}>
								{t('calculationMethod')}
							</h4>
							<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
								<button
									type="button"
									onClick={() => setCalculationMode('simple')}
									style={{
										padding: '0.5rem 1rem',
										border: `2px solid ${calculationMode === 'simple' ? 'var(--accent-color-primary)' : 'var(--border-primary-color)'}`,
										backgroundColor:
											calculationMode === 'simple'
												? 'var(--accent-color-primary)'
												: 'transparent',
										color:
											calculationMode === 'simple'
												? 'white'
												: 'var(--text-color-primary)',
										borderRadius: '0.5rem',
										cursor: 'pointer',
										fontSize: '0.9rem',
										fontWeight: '500',
									}}
								>
									{t('basicEstimate')}
								</button>
								<button
									type="button"
									onClick={() => setCalculationMode('enhanced')}
									style={{
										padding: '0.5rem 1rem',
										border: `2px solid ${calculationMode === 'enhanced' ? 'var(--accent-color-primary)' : 'var(--border-primary-color)'}`,
										backgroundColor:
											calculationMode === 'enhanced'
												? 'var(--accent-color-primary)'
												: 'transparent',
										color:
											calculationMode === 'enhanced'
												? 'white'
												: 'var(--text-color-primary)',
										borderRadius: '0.5rem',
										cursor: 'pointer',
										fontSize: '0.9rem',
										fontWeight: '500',
									}}
								>
									{t('detailedEstimate')}
								</button>
								<button
									type="button"
									onClick={() => setCalculationMode('conservative')}
									style={{
										padding: '0.5rem 1rem',
										border: `2px solid ${calculationMode === 'conservative' ? 'var(--accent-color-primary)' : 'var(--border-primary-color)'}`,
										backgroundColor:
											calculationMode === 'conservative'
												? 'var(--accent-color-primary)'
												: 'transparent',
										color:
											calculationMode === 'conservative'
												? 'white'
												: 'var(--text-color-primary)',
										borderRadius: '0.5rem',
										cursor: 'pointer',
										fontSize: '0.9rem',
										fontWeight: '500',
									}}
								>
									{t('realisticEstimate')}
									<span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
										{' '}
										{t('recommended')}
									</span>
								</button>
							</div>
							<p
								style={{
									fontSize: '0.85rem',
									color: 'var(--text-color-secondary)',
									marginTop: '0.75rem',
									lineHeight: '1.4',
								}}
							>
								{calculations.description}
							</p>
						</div>

						<RewardGrid.Root>
							<RewardGrid.Head>
								<RewardGrid.Cells
									items={[
										<h4>{t('period')}</h4>,
										<h4>
											<Token />
											{unit}
										</h4>,
										<h4>{currency}</h4>,
									]}
								/>
							</RewardGrid.Head>
							<RewardGrid.Row>
								<RewardGrid.Cell>
									<RewardGrid.Label>{t('daily')}</RewardGrid.Label>
								</RewardGrid.Cell>
								<RewardGrid.Cell>
									<h3>
										{dailyReward > 0 && <FontAwesomeIcon icon={faCaretUp} />}
										{dailyReward.toLocaleString('en-US', {
											minimumFractionDigits: 3,
											maximumFractionDigits: 3,
										})}
									</h3>
								</RewardGrid.Cell>
								<RewardGrid.Cell>
									<h3>
										{dailyReward > 0 && tokenPrice > 0 && (
											<FontAwesomeIcon icon={faCaretUp} />
										)}
										{formatLocalCurrency(dailyReward * tokenPrice)}
									</h3>
								</RewardGrid.Cell>
							</RewardGrid.Row>
							<RewardGrid.Row>
								<RewardGrid.Cells
									items={[
										<RewardGrid.Label>{t('monthly')}</RewardGrid.Label>,
										<h3>
											{monthlyReward > 0 && (
												<FontAwesomeIcon icon={faCaretUp} />
											)}
											{monthlyReward.toLocaleString('en-US', {
												minimumFractionDigits: 3,
												maximumFractionDigits: 3,
											})}
										</h3>,
										<h3>
											{monthlyReward > 0 && tokenPrice > 0 && (
												<FontAwesomeIcon icon={faCaretUp} />
											)}
											{formatLocalCurrency(monthlyReward * tokenPrice)}
										</h3>,
									]}
								/>
							</RewardGrid.Row>
							<RewardGrid.Row>
								<RewardGrid.Cells
									items={[
										<RewardGrid.Label>{t('annual')}</RewardGrid.Label>,
										<h3>
											{annualReward > 0 && <FontAwesomeIcon icon={faCaretUp} />}
											{annualReward.toLocaleString('en-US', {
												minimumFractionDigits: 3,
												maximumFractionDigits: 3,
											})}
										</h3>,
										<h3>
											{annualReward > 0 && tokenPrice > 0 && (
												<FontAwesomeIcon icon={faCaretUp} />
											)}
											{formatLocalCurrency(annualReward * tokenPrice)}
										</h3>,
									]}
								/>
							</RewardGrid.Row>
						</RewardGrid.Root>
					</CardWrapper>
				</Page.Row>
			)}
		</>
	)
}
