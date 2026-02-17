// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTooltip } from 'contexts/Tooltip'
import { emitNotification } from 'global-bus'
import { useTranslation } from 'react-i18next'
import { TooltipArea } from 'ui-core/base'
import { HeaderButton } from 'ui-core/list'

export type ShareLinkProps = {
	// The URL search param value, e.g. a validator address or pool id
	paramValue: string
	// The URL search param key, e.g. 'v' for validator or 'p' for pool
	paramKey: string
}

export const ShareLink = ({ paramValue, paramKey }: ShareLinkProps) => {
	const { t } = useTranslation('app')
	const { setTooltipTextAndOpen } = useTooltip()

	const tooltipText = t('copyShareLink')

	const buildShareUrl = () => {
		const base = `https://staking.polkadot.cloud/#/overview`
		return `${base}?${paramKey}=${paramValue}`
	}

	return (
		<HeaderButton>
			<TooltipArea
				pointer
				text={tooltipText}
				onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
				onClick={() => {
					const url = buildShareUrl()
					navigator.clipboard.writeText(url)
					emitNotification({
						title: t('linkCopied'),
						subtitle: url,
					})
				}}
			/>
			<button type="button">
				<FontAwesomeIcon icon={faLink} transform="shrink-2" />
			</button>
		</HeaderButton>
	)
}
