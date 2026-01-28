// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useWarnings } from 'hooks/useWarnings'
import { StatItem } from 'pages/Overview/Summaries/Wrappers'
import { Badge, Page } from 'ui-core/base'

export const PageWarnings = () => {
	const { warningMessages } = useWarnings()

	return (
		<>
			{warningMessages.length > 0 && (
				<Page.Row yMargin>
					<Page.RowSection standalone>
						{warningMessages.map(
							({ value, label, description, format, faIcon }) => (
								<StatItem className={`${format} vList`} key={value}>
									<div className={`inner asBadge ${format}`}>
										<Badge variant={format}>
											<FontAwesomeIcon icon={faIcon} />
											{description}
											{label && <span>{label}</span>}
										</Badge>
									</div>
								</StatItem>
							),
						)}
					</Page.RowSection>
				</Page.Row>
			)}
		</>
	)
}
