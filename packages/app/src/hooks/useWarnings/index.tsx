// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircleUp, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { poolWarnings$ } from 'global-bus'
import type { WarningMessage } from 'pages/Overview/Summaries/types'
import { useEffect, useState } from 'react'

export const useWarnings = () => {
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
						value: 'Pool is Destroying',
						description:
							'Your pool is being destroyed and you cannot earn pool rewards.',
						format: 'danger',
						faIcon: faTrashCan,
					})
				} else if (warning.type === 'highCommission') {
					messages.push({
						value: 'High Commission',
						faIcon: faCircleUp,
						description:
							"Your pool's commission is high. Consider joining a different pool to increase rewards.",
						format: 'warning',
					})
				}
			})

			messages.push({
				value: 'Pool is Destroying',
				description:
					'Your pool is being destroyed and you cannot earn pool rewards.',
				format: 'danger',
				faIcon: faTrashCan,
			})

			setWarningMessages(messages)
		})

		return () => subscription.unsubscribe()
	}, [activeAddress])

	return { warningMessages }
}
