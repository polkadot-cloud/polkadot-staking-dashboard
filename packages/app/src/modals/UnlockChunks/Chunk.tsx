// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheckCircle, faClock } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTimeLeft } from '@w3ux/hooks'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { fromUnixTime } from 'date-fns'
import { useErasToTimeLeft } from 'hooks/useErasToTimeLeft'
import { useEraTimeLeft } from 'hooks/useEraTimeLeft'
import { Countdown } from 'library/Countdown'
import { ProgressBar } from 'library/ProgressBar'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSubmit } from 'ui-buttons'
import { formatTimeleft, planckToUnitBn } from 'utils'
import type { ChunkProps } from './types'
import { ChunkWrapper } from './Wrappers'

export const Chunk = ({ chunk, bondFor, onRebond }: ChunkProps) => {
	const { t, i18n } = useTranslation('modals')

	const { getConsts, activeEra } = useApi()
	const { network } = useNetwork()
	const { activeAddress } = useActiveAccounts()
	const { erasToSeconds } = useErasToTimeLeft()
	const { get: getEraTimeleft } = useEraTimeLeft()

	const { timeleft, setFromNow } = useTimeLeft({
		depsTimeleft: [network],
		depsFormat: [i18n.resolvedLanguage],
	})

	const { unit, units } = getStakingChainData(network)
	const { bondDuration } = getConsts(network)
	const isStaking = bondFor === 'nominator'
	const { era, value } = chunk
	const left = new BigNumber(era).minus(activeEra.index)
	const start = Number(activeEra.start / 1000n)
	const erasDuration = erasToSeconds(left.toNumber())

	const dateFrom = fromUnixTime(start)
	const dateTo = fromUnixTime(start + erasDuration)
	const formatted = formatTimeleft(t, timeleft.raw)

	// Calculate unbonding progress percentage. Adapts dynamically to bond
	// duration from chain constants (works for both 28-day and 1-day unbonding).
	const isUnlocked = left.isLessThanOrEqualTo(0)
	const startEra = era - bondDuration
	const erasCompleted = activeEra.index - startEra

	// Add sub-era interpolation so the bar moves within the current era.
	const { percentSurpassed } = getEraTimeleft()
	const subEraFraction = percentSurpassed / 100

	const progress = isUnlocked
		? 100
		: Math.min(
				100,
				Math.max(0, ((erasCompleted + subEraFraction) / bondDuration) * 100),
			)

	// reset timer on account or network change.
	useEffect(() => {
		setFromNow(dateFrom, dateTo)
	}, [activeAddress, network])

	return (
		<ChunkWrapper>
			<div>
				<div className="chunk-header">
					<h2>{`${planckToUnitBn(new BigNumber(value), units)} ${unit}`}</h2>
					{isStaking && (
						<ButtonSubmit
							text={t('rebond')}
							disabled={false}
							onClick={() => onRebond(chunk)}
						/>
					)}
				</div>
				<span className={isUnlocked ? 'status-line ready' : 'status-line'}>
					<FontAwesomeIcon icon={isUnlocked ? faCheckCircle : faClock} />
					{isUnlocked ? (
						t('readyToWithdraw')
					) : (
						<Countdown timeleft={formatted} markup={false} />
					)}
				</span>
				<ProgressBar
					progress={progress}
					status={isUnlocked ? 'unlocked' : 'unbonding'}
					showLabel={false}
				/>
				{!isUnlocked && (
					<div className="chunk-bar-labels">
						<span>{`${t('unlocksInEra')} ${era}`}</span>
						<span>{`${Math.round(progress)}%`}</span>
					</div>
				)}
			</div>
		</ChunkWrapper>
	)
}
