// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTimeLeft } from '@w3ux/hooks'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { fromUnixTime } from 'date-fns'
import { useErasToTimeLeft } from 'hooks/useErasToTimeLeft'
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
	const progress = isUnlocked
		? 100
		: Math.min(
				100,
				Math.max(0, ((activeEra.index - startEra) / bondDuration) * 100),
			)

	// reset timer on account or network change.
	useEffect(() => {
		setFromNow(dateFrom, dateTo)
	}, [activeAddress, network])

	return (
		<ChunkWrapper>
			<div>
				<section>
					<h2>{`${planckToUnitBn(new BigNumber(value), units)} ${unit}`}</h2>
					<ProgressBar
						progress={progress}
						status={isUnlocked ? 'unlocked' : 'unbonding'}
					/>
					<h4>
						{isUnlocked ? (
							t('unlocked')
						) : (
							<>
								{t('unlocksInEra')} {era} /&nbsp;
								<Countdown timeleft={formatted} markup={false} />
							</>
						)}
					</h4>
				</section>
				{isStaking ? (
					<section>
						<div>
							<ButtonSubmit
								text={t('rebond')}
								disabled={false}
								onClick={() => onRebond(chunk)}
							/>
						</div>
					</section>
				) : null}
			</div>
		</ChunkWrapper>
	)
}
