// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { useNetwork } from 'contexts/Network'
import { useUi } from 'contexts/UI'
import {
	onCreatePoolButtonPressedEvent,
	onJoinPoolButtonPressedEvent,
} from 'event-tracking'
import { useActiveAccountPool } from 'hooks/useActiveAccountPool'
import { CallToActionButtons } from 'library/CallToActionButtons'
import type { CallToActionSection } from 'library/CallToActionButtons/types'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useOverlay } from 'ui-overlay'
import type { NewMemberProps } from './types'

export const NewMember = ({ syncing, showOtherOptions }: NewMemberProps) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { network } = useNetwork()
	const { advancedMode } = useUi()
	const { openModal } = useOverlay().modal
	const { openCanvas } = useOverlay().canvas
	const { getJoinDisabled, getCreateDisabled } = useActiveAccountPool()

	// Alias for create button disabled state
	const createDisabled = getCreateDisabled()

	// Disable opening the canvas if data is not ready.
	const joinButtonDisabled = getJoinDisabled()

	// Handle join pool button press
	const handleOnJoinPool = () => {
		if (!advancedMode) {
			// On simple mode, open Join Pool modal
			openModal({ key: 'JoinPool', size: 'xs' })
		} else {
			// On advanced mode, open Pool canvas
			onJoinPoolButtonPressedEvent(network)
			openCanvas({
				key: 'Pool',
				options: {},
				size: 'xl',
			})
		}
	}

	const sections: CallToActionSection[] = [
		{
			buttons: [
				{
					label: t('joinPool', { ns: 'pages' }),
					onClick: handleOnJoinPool,
					disabled: joinButtonDisabled,
					kind: 'primary',
					pulse: !joinButtonDisabled,
					icon: faUserPlus,
					iconPosition: 'after',
				},
			],
		},
	]

	if (advancedMode && !showOtherOptions) {
		sections.push({
			buttons: [
				{
					label: t('createPool', { ns: 'pages' }),
					onClick: () => {
						onCreatePoolButtonPressedEvent(network)
						openCanvas({
							key: 'CreatePool',
							options: {},
							size: 'xl',
						})
					},
					disabled: createDisabled,
					kind: 'secondary',
				},
				{
					label: t('browsePools', { ns: 'pages' }),
					onClick: () => navigate('/pools'),
					kind: 'secondary',
				},
			],
		})
	}

	if (showOtherOptions) {
		sections.push({
			buttons: [
				{
					label: t('otherOptions', { ns: 'app' }),
					onClick: () =>
						openModal({
							key: 'StakingOptions',
							size: 'xs',
							options: { context: 'simple_other_options' },
						}),
					kind: 'secondary',
				},
			],
		})
	}

	return (
		<CallToActionButtons
			syncing={syncing}
			style={{ marginTop: '1rem' }}
			sections={sections}
		/>
	)
}
