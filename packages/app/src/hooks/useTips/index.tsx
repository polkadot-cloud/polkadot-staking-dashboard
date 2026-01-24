// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { TipsConfigAdvanced, TipsConfigSimple } from 'config/tips'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { useUi } from 'contexts/UI'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useFillVariables } from 'hooks/useFillVariables'
import { DefaultLocale } from 'locales'
import { useTranslation } from 'react-i18next'

export const useTips = () => {
	const { i18n, t } = useTranslation()
	const { advancedMode } = useUi()
	const { isNominating } = useStaking()
	const { inPool, isOwner } = useActivePool()
	const { fillVariables } = useFillVariables()
	const { activeAddress } = useActiveAccounts()
	const { hasEnoughToNominate } = useAccountBalances(activeAddress)

	// Get tips based on app mode
	const config = advancedMode ? TipsConfigAdvanced : TipsConfigSimple

	// Accumulate segments to include in tips
	const segments: number[] = []
	if (!activeAddress) {
		segments.push(1)
	} else if (!isNominating && !inPool) {
		if (hasEnoughToNominate) {
			segments.push(2)
		} else {
			segments.push(3)
		}
		segments.push(4)
	} else {
		if (isNominating) {
			segments.push(5)
		}
		if (inPool) {
			if (!isOwner()) {
				segments.push(6)
			} else {
				segments.push(7)
			}
		}
		segments.push(8)
	}

	// Configure tip items based on segments and staking state
	let items = config.filter((i) => segments.includes(i.s))

	// If user is both nominating and in a pool, and in simple mode, filter out tips that redirect to
	// 'stake' page as the stake page will not be accessible (pool and nominate pages will be
	// accessible instead).
	if (isNominating && inPool && !advancedMode) {
		items = items.filter((i) => i.page !== 'stake')
	}

	items = items.map((item) => {
		const { id } = item

		return fillVariables(
			{
				...item,
				title: t(`${id}.0`, { ns: 'tips' }),
				subtitle: t(`${id}.1`, { ns: 'tips' }),
				description: i18n.getResource(
					i18n.resolvedLanguage ?? DefaultLocale,
					'tips',
					`${id}.2`,
				),
			},
			['title', 'subtitle', 'description'],
		)
	})

	return { items }
}
