// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTimeLeft } from '@w3ux/hooks'
import { secondsFromNow } from '@w3ux/hooks/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { fromUnixTime, getUnixTime } from 'date-fns'
import { useEraTimeLeft } from 'hooks/useEraTimeLeft'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { formatTimeleft } from 'utils'
import type { UseNextRewardsReturn } from './types'

export const useNextRewards = (): UseNextRewardsReturn => {
	const { t, i18n } = useTranslation('pages')
	const { activeEra } = useApi()
	const { network } = useNetwork()
	const { get: getEraTimeleft } = useEraTimeLeft()
	const { timeleft, setFromNow } = useTimeLeft({
		depsTimeleft: [network],
		depsFormat: [i18n.resolvedLanguage],
	})
	const timeleftResult = getEraTimeleft()
	const dateFrom = fromUnixTime(Date.now() / 1000)
	const formatted = formatTimeleft(t, timeleft.raw)
	const dateTo = secondsFromNow(timeleftResult.timeleft)

	// Reset timer on era change (also covers network change)
	useEffect(() => {
		setFromNow(dateFrom, dateTo)
	}, [activeEra, getUnixTime(dateTo)])

	return {
		formatted,
		timeleftResult,
		activeEra,
	}
}
