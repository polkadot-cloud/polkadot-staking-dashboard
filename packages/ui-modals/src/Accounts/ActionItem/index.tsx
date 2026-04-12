// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './index.module.scss'

export const ActionItem = ({ text }: { text: string }) => (
	<h3 className={classes.actionItem}>
		<FontAwesomeIcon icon={faChevronRight} transform="shrink-6" />
		{text}
	</h3>
)
