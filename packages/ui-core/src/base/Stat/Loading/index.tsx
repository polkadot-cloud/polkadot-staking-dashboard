// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Loader } from '../../Loader'
import { Card } from '../Card'
import { Content } from '../Content'

export const Loading = () => {
	return (
		<Card>
			<div>
				<Content>
					<Loader
						style={{
							height: '1.75rem',
							width: '45%',
							marginBottom: '0.6rem',
							opacity: 0.4,
						}}
					/>
					<Loader
						style={{
							height: '1rem',
							width: '75%',
							opacity: 0.4,
						}}
					/>
				</Content>
			</div>
		</Card>
	)
}
