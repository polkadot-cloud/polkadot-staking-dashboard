// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Card } from '../Card'
import { Content } from '../Content'
import classes from './index.module.scss'

export const Loading = () => {
	return (
		<Card>
			<div>
				<Content>
					<div className={classes.shimmerTitle}>
						<div className={classes.shimmerInner} />
					</div>
					<div className={classes.shimmerSubtitle}>
						<div className={classes.shimmerInner} />
					</div>
				</Content>
			</div>
		</Card>
	)
}
