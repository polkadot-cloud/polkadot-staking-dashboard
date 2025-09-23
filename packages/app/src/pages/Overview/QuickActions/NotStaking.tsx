// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
/** biome-ignore-all lint/correctness/noNestedComponentDefinitions: <> */
// SPDX-License-Identifier: GPL-3.0-only

import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import {
	faChartLine,
	faEnvelope,
	faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DiscordSupportUrl, MailSupportAddress } from 'consts'
import { useNominatorSetups } from 'contexts/NominatorSetups'
import { useTranslation } from 'react-i18next'
import { QuickAction } from 'ui-buttons'
import type { ButtonQuickActionProps } from 'ui-buttons/types'
import { useOverlay } from 'ui-overlay'

export const NotStaking = () => {
	const { t } = useTranslation('pages')
	const { openCanvas } = useOverlay().canvas
	const { setNominatorSetup, generateOptimalSetup } = useNominatorSetups()

	const actions: ButtonQuickActionProps[] = [
		{
			onClick: () => {
				openCanvas({
					key: 'Pool',
					size: 'xl',
				})
			},
			disabled: false,
			Icon: () => <FontAwesomeIcon transform="grow-1" icon={faUsers} />,
			label: t('joinPool'),
		},
		{
			onClick: () => {
				// Set optimal nominator setup here, ready for canvas to display summary
				setNominatorSetup(generateOptimalSetup(), true, 4)
				openCanvas({
					key: 'NominatorSetup',
					options: {
						simple: true,
					},
					size: 'xl',
				})
			},
			disabled: false,
			Icon: () => <FontAwesomeIcon transform="grow-1" icon={faChartLine} />,
			label: t('startNominating'),
		},
		{
			onClick: () => {
				window.open(`mailto:${MailSupportAddress}`, '_blank')
			},
			disabled: false,
			Icon: () => <FontAwesomeIcon transform="grow-2" icon={faEnvelope} />,
			label: t('email', { ns: 'app' }),
		},
		{
			onClick: () => {
				window.open(DiscordSupportUrl, '_blank')
			},
			disabled: false,
			Icon: () => <FontAwesomeIcon transform="grow-2" icon={faDiscord} />,
			label: 'Discord',
		},
	]

	return (
		<QuickAction.Container>
			{actions.map((action, i) => (
				<QuickAction.Button key={`action-${i}`} {...action} />
			))}
		</QuickAction.Container>
	)
}
