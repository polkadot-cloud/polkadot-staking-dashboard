// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNavigate } from 'react-router-dom'
import { Padding, Title } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'

export const Transfer = () => {
	const navigate = useNavigate()
	const { closeModal } = useOverlay().modal

	return (
		<>
			<Close />
			<Padding>
				<Title>Send</Title>
				<p>Stablecoin transfers use the Send page.</p>
				<button
					type="button"
					className="stablecoinsPrimary"
					onClick={() => {
						navigate('/send')
						closeModal()
					}}
				>
					Open Send
				</button>
			</Padding>
		</>
	)
}
