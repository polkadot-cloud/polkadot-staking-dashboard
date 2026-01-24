// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTimeLeft } from '@w3ux/hooks'
import { secondsFromNow } from '@w3ux/hooks/util'
import { useThemeValues } from 'contexts/ThemeValues'
import { fromUnixTime, getUnixTime } from 'date-fns'
import { Countdown } from 'library/Countdown'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Countdown as CountdownWrapper } from 'ui-core/base'
import { HalvingLine } from 'ui-graphs'
import { formatTimeleft } from 'utils'
import { StatusWrapper } from '../Wrappers'

export const Halving = () => {
	const { t, i18n } = useTranslation()
	const { getThemeValue } = useThemeValues()

	// Calculate next halving date (March 14th every 2 years starting in 2026)
	const getNextHalvingDate = () => {
		const now = new Date()
		const currentYear = now.getFullYear()
		const baseYear = 2026

		// Calculate the next halving year based on the 2-year cycle
		let nextYear: number
		if (currentYear < baseYear) {
			nextYear = baseYear
		} else {
			// Calculate years since base year
			const yearsSinceBase = currentYear - baseYear
			// Round up to next even number (0, 2, 4, 6, etc.)
			const nextCycle = Math.ceil(yearsSinceBase / 2) * 2
			nextYear = baseYear + nextCycle
		}

		// Check if we've passed March 14 this year
		const nextHalving = new Date(nextYear, 2, 14) // March is month 2 (0-indexed)
		if (now > nextHalving) {
			nextYear += 2
			return new Date(nextYear, 2, 14)
		}

		return nextHalving
	}

	const nextHalvingDate = getNextHalvingDate()
	const nextHalvingUnix = Math.floor(nextHalvingDate.getTime() / 1000)

	const { timeleft, setFromNow } = useTimeLeft({
		depsTimeleft: [],
		depsFormat: [i18n.resolvedLanguage],
	})

	const dateFrom = fromUnixTime(Date.now() / 1000)
	const dateTo = secondsFromNow(nextHalvingUnix - Math.floor(Date.now() / 1000))
	const formatted = formatTimeleft(t, timeleft.raw)

	useEffect(() => {
		setFromNow(dateFrom, dateTo)
	}, [getUnixTime(dateTo)])

	return (
		<StatusWrapper>
			<div
				style={{
					padding: '0 1.25rem 1.25rem 1rem',
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
				}}
			>
				<h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
					{t('nextHalving', { ns: 'app' })}:{' '}
					<CountdownWrapper>
						<Countdown timeleft={formatted} />
					</CountdownWrapper>
				</h3>
				<div style={{ marginTop: '1rem', flex: 1, minHeight: 0 }}>
					<HalvingLine
						width="100%"
						height="100%"
						getThemeValue={getThemeValue}
						labels={{
							year: t('year', { ns: 'app' }),
							issuance: t('newIssuance', { ns: 'app' }),
							newIssuance: t('newIssuance', { ns: 'app' }),
						}}
					/>
				</div>
			</div>
		</StatusWrapper>
	)
}
