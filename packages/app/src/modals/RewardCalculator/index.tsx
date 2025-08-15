// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getChainIcons } from 'assets'
import { getStakingChainData } from 'consts/util'
import { useNetwork } from 'contexts/Network'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { useEnhancedRewardRate } from 'hooks/useEnhancedRewardRate'
import { Balance } from 'library/Balance'
import { Title } from 'library/Modal/Title'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CardHeader, Separator } from 'ui-core/base'
import { TokenInput } from 'ui-core/input'
import { Padding } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'
import { ContentWrapper } from '../Networks/Wrapper'

const DEFAULT_TOKEN_INPUT = 1000

export const RewardCalculator = () => {
	const { t } = useTranslation()
	const { network } = useNetwork()
	const { config } = useOverlay().modal
	const { avgCommission } = useValidators()
	const { getAverageRewardRate } = useAverageRewardRate()
	const { calculateAnnualRewardWithActualCommission, getActualCommissionRate } =
		useEnhancedRewardRate()

	const { unit } = getStakingChainData(network)
	const Token = getChainIcons(network).token
	const { currency } = config.options

	// Store token amount to stake
	const [stakeAmount, setStakeAmount] = useState<number>(DEFAULT_TOKEN_INPUT)

	// Calculation mode: 'simple', 'enhanced', 'conservative'
	const [calculationMode, setCalculationMode] = useState<
		'simple' | 'enhanced' | 'conservative'
	>('conservative')

	// Calculate rewards based on selected mode
	const getRewardCalculations = () => {
		const actualCommissionRate = getActualCommissionRate()

		switch (calculationMode) {
			case 'simple': {
				// Original simple calculation
				const annualRewardBase =
					stakeAmount * (getAverageRewardRate() / 100) || 0
				const annualRewardAfterCommission =
					annualRewardBase * (1 - avgCommission / 100)
				return {
					annual: annualRewardAfterCommission,
					monthly: annualRewardAfterCommission / 12,
					daily: annualRewardAfterCommission / 365,
					commissionRate: avgCommission,
					description: t('simpleCalculationDesc', { ns: 'pages' }),
				}
			}
			case 'enhanced': {
				// Enhanced with era points but optimistic
				const enhancedRewards = calculateAnnualRewardWithActualCommission(
					stakeAmount,
					false,
				)
				return {
					annual: enhancedRewards.afterCommission,
					monthly: enhancedRewards.afterCommission / 12,
					daily: enhancedRewards.afterCommission / 365,
					commissionRate: actualCommissionRate,
					description: t('enhancedCalculationDesc', { ns: 'pages' }),
				}
			}
			case 'conservative':
			default: {
				// Enhanced with conservative adjustment (most accurate)
				const enhancedRewards = calculateAnnualRewardWithActualCommission(
					stakeAmount,
					true,
				)
				return {
					annual: enhancedRewards.afterCommission,
					monthly: enhancedRewards.afterCommission / 12,
					daily: enhancedRewards.afterCommission / 365,
					commissionRate: actualCommissionRate,
					description: t('conservativeCalculationDesc', { ns: 'pages' }),
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

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const isNumber = !isNaN(Number(e.target.value))
		if (!isNumber) {
			return
		}
		setStakeAmount(Number(e.target.value))
	}

	return (
		<div style={{ padding: '0 0.5rem' }}>
			<Title
				title={t('rewardCalculator', { ns: 'pages' })}
				style={{ paddingLeft: '0.5rem' }}
			/>
			<Padding horizontalOnly>
				<ContentWrapper>
					<h4>{t('rewardCalcSubtitle', { ns: 'pages', unit })}</h4>
					<TokenInput
						id="reward-calc-token-input"
						label={`${t('unitAmount', { ns: 'pages', unit })}`}
						onChange={onChange}
						placeholder={t('stakePlaceholder', { ns: 'pages' })}
						value={String(stakeAmount || 0)}
						marginY
					/>{' '}
					<div style={{ padding: '0.5rem' }}>
						<h4 style={{ marginBottom: '0.75rem' }}>
							{t('calculationMethod', { ns: 'pages' })}
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
								{t('basicEstimate', { ns: 'pages' })}
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
								{t('detailedEstimate', { ns: 'pages' })}
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
								{t('realisticEstimate', { ns: 'pages' })}
								<span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
									{' '}
									{t('recommended', { ns: 'pages' })}
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
					<Separator lg />
					<CardHeader>
						<h4>
							{t('daily', { ns: 'pages' })} {t('rewards', { ns: 'modals' })}
						</h4>
						<Balance.WithFiat
							Token={<Token />}
							value={dailyReward}
							currency={currency}
						/>
					</CardHeader>
					<Separator lg />
					<CardHeader>
						<h4>
							{t('monthly', { ns: 'pages' })} {t('rewards', { ns: 'modals' })}
						</h4>
						<Balance.WithFiat
							Token={<Token />}
							value={monthlyReward}
							currency={currency}
						/>
					</CardHeader>
					<Separator lg />
					<CardHeader>
						<h4>
							{t('annual', { ns: 'pages' })} {t('rewards', { ns: 'modals' })}
						</h4>
						<Balance.WithFiat
							Token={<Token />}
							value={annualReward}
							currency={currency}
						/>
					</CardHeader>
					<Separator transparent style={{ marginTop: '2.5rem' }} />
				</ContentWrapper>
			</Padding>
		</div>
	)
}
