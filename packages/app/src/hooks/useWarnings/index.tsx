// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircleUp, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { poolWarnings$ } from 'global-bus'
import type { WarningMessage } from 'pages/Overview/Summaries/types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const useWarnings = () => {
	const { t } = useTranslation('app')
	const { activeAddress } = useActiveAccounts()
	const [warningMessages, setWarningMessages] = useState<WarningMessage[]>([])

	useEffect(() => {
		const subscription = poolWarnings$.subscribe((poolWarnings) => {
			if (!activeAddress) {
				setWarningMessages([])
				return
			}

			const warnings = poolWarnings[activeAddress] || []
			const messages: WarningMessage[] = []

			warnings.forEach((warning) => {
				if (warning.type === 'destroying') {
					messages.push({
						value: t('warnings.destroyingTitle'),
						description: t('warnings.destroyingDescription'),
						format: 'danger',
						faIcon: faTrashCan,
					})
				} else if (warning.type === 'highCommission') {
					messages.push({
						value: t('warnings.highCommissionTitle'),
						faIcon: faCircleUp,
						description: t('warnings.highCommissionDescription'),
						format: 'warning',
					})
				}
			})

			messages.push({
				value: t('warnings.highCommissionTitle'),
				faIcon: faCircleUp,
				description: t('warnings.highCommissionDescription'),
				format: 'warning',
			})

			setWarningMessages(messages)
		})

		return () => subscription.unsubscribe()
	}, [activeAddress])

	const getMostSevereWarningFormat = () => {
		let format: 'danger' | 'warning' = 'warning'

		warningMessages.forEach((message) => {
			if (message.format === 'danger') {
				format = 'danger'
				return
			} else if (message.format === 'warning') {
				format = 'warning'
			}
		})
		return format
	}

	return { warningMessages, getMostSevereWarningFormat }
}
