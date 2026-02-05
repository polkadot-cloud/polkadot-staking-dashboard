// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useEraStakers } from 'contexts/EraStakers'
import { useNetwork } from 'contexts/Network'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { useNextRewards } from 'hooks/useNextRewards'
import { useSupplyStaked } from 'hooks/useSupplyStaked'
import { type StatConfig, StatType } from 'library/Stats/types'
import { useTranslation } from 'react-i18next'
import { percentageOf } from 'ui-graphs/util'
import { planckToUnitBn } from 'utils'

export const useStats = (
	isPreloading?: boolean,
): Record<string, StatConfig> => {
	const { t } = useTranslation('pages')
	const { network } = useNetwork()
	const { unit, units } = getStakingChainData(network)
	const { minJoinBond, counterForBondedPools, minCreateBond } =
		useApi().poolsConfig
	const {
		stakingMetrics: {
			validatorCount,
			counterForValidators,
			maxValidatorsCount,
			counterForNominators,
			minNominatorBond,
			minimumActiveStake,
		},
	} = useApi()
	const { activeValidators, activeNominatorsCount } = useEraStakers()
	const { avgCommission } = useValidators()
	const { supplyString, supplyNumber } = useSupplyStaked()
	const { formatted, timeleftResult, activeEra } = useNextRewards()
	const { getAverageRewardRate, formatRateAsPercent } = useAverageRewardRate()
	const minToEarnRewards = BigNumber.max(minNominatorBond, minimumActiveStake)

	const stats: Record<string, StatConfig> = {}

	stats.averageRewardRate = {
		type: StatType.TEXT,
		label: t('averageRewardRate'),
		value: formatRateAsPercent(getAverageRewardRate()),
		helpKey: 'Average Reward Rate',
		primary: true,
		isPreloading,
	}

	stats.supplyStaked = {
		type: StatType.PIE,
		label: t('unitSupplyStaked', { unit }),
		value: supplyString,
		unit: '%',
		pieValue: supplyNumber,
		tooltip: `${supplyString}%`,
		helpKey: 'Supply Staked',
	}

	stats.nextReward = {
		type: StatType.TIMELEFT,
		label: t('nextRewardDistribution'),
		timeleft: formatted,
		graph: {
			value1: activeEra.index === 0 ? 0 : timeleftResult.percentSurpassed,
			value2: activeEra.index === 0 ? 100 : timeleftResult.percentRemaining,
		},
		tooltip: `Era ${new BigNumber(activeEra.index).toFormat()}`,
		isPreloading,
	}

	// Validator stats
	stats.activeValidators = {
		type: StatType.PIE,
		label: t('activeValidators'),
		value: activeValidators,
		total: validatorCount,
		unit: '',
		pieValue: percentageOf(activeValidators, validatorCount),
		tooltip: `${
			validatorCount > 0
				? new BigNumber(activeValidators)
						.dividedBy(validatorCount * 0.01)
						.decimalPlaces(2)
						.toFormat()
				: '0'
		}%`,
		helpKey: 'Active Validator',
	}

	stats.averageCommission = {
		type: StatType.TEXT,
		label: t('averageCommission'),
		value: `${String(avgCommission)}%`,
		helpKey: 'Average Commission',
	}

	stats.totalValidators = {
		type: StatType.PIE,
		label: t('totalValidators'),
		value: counterForValidators,
		total: maxValidatorsCount,
		unit: '',
		pieValue: maxValidatorsCount
			? percentageOf(counterForValidators, maxValidatorsCount)
			: 0,
		tooltip: `${
			maxValidatorsCount && maxValidatorsCount > 0
				? new BigNumber(counterForValidators / (maxValidatorsCount / 100))
						.decimalPlaces(2)
						.toFormat()
				: '0'
		}%`,
		helpKey: 'Validator',
	}

	stats.minimumToJoinPool = {
		type: StatType.NUMBER,
		label: t('minimumToJoinPool'),
		value: parseFloat(planckToUnit(minJoinBond, units)),
		decimals: 3,
		unit: ` ${unit}`,
		helpKey: 'Minimum To Join Pool',
		isPreloading,
	}

	stats.activePools = {
		type: StatType.NUMBER,
		label: t('activePools'),
		value: counterForBondedPools,
		unit: '',
		helpKey: 'Active Pools',
	}

	stats.minimumToJoinPool = {
		type: StatType.NUMBER,
		label: t('minimumToJoinPool'),
		value: parseFloat(planckToUnit(minJoinBond, units)),
		decimals: 3,
		unit: ` ${unit}`,
		helpKey: 'Minimum To Join Pool',
	}

	stats.minimumToCreatePool = {
		type: StatType.NUMBER,
		label: t('minimumToCreatePool'),
		value: parseFloat(planckToUnit(minCreateBond, units)),
		decimals: 3,
		unit,
		helpKey: 'Minimum To Create Pool',
	}

	// Nominator stats
	stats.activeNominators = {
		type: StatType.PIE,
		label: t('activeNominators'),
		value: activeNominatorsCount,
		total: counterForNominators,
		unit: '',
		pieValue:
			counterForNominators > 0
				? percentageOf(activeNominatorsCount, counterForNominators)
				: 0,
		tooltip: `${
			counterForNominators > 0
				? new BigNumber(
						percentageOf(activeNominatorsCount, counterForNominators),
					)
						.decimalPlaces(2)
						.toFormat()
				: '0'
		}%`,
		helpKey: 'Active Nominators',
	}

	stats.minimumNominatorBond = {
		type: StatType.NUMBER,
		label: t('minimumToNominate'),
		value: parseFloat(planckToUnit(minNominatorBond, units)),
		decimals: 3,
		unit: `${unit}`,
		helpKey: 'Bonding',
	}

	stats.minimumActiveStake = {
		type: StatType.NUMBER,
		label: t('minimumToEarnRewards'),
		value: planckToUnitBn(minToEarnRewards, units).toNumber(),
		decimals: 3,
		unit: `${unit}`,
		helpKey: 'Bonding',
	}

	return stats
}
