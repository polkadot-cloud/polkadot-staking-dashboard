// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { onNewNominatorButtonPressedEvent } from 'event-tracking'
import { CallToActionButtons } from 'library/CallToActionButtons'
import type { CallToActionSection } from 'library/CallToActionButtons/types'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useOverlay } from 'ui-overlay'
import type { NewNominatorProps } from '../types'

export const NewNominator = ({ syncing }: NewNominatorProps) => {
	const { t } = useTranslation()
	const { isReady } = useApi()
	const navigate = useNavigate()
	const { network } = useNetwork()
	const { openModal } = useOverlay().modal
	const { activeAddress } = useActiveAccounts()
	const { isNominating } = useStaking()
	const { isReadOnlyAccount } = useImportedAccounts()

	const nominateButtonDisabled =
		!isReady ||
		!activeAddress ||
		isNominating ||
		isReadOnlyAccount(activeAddress)

	const sections: CallToActionSection[] = [
		{
			className: 'standalone',
			buttons: [
				{
					label: t('startNominating', { ns: 'pages' }),
					onClick: () => {
						onNewNominatorButtonPressedEvent(network)
						openModal({
							key: 'StakingOptions',
							options: {},
							size: 'xs',
						})
					},
					disabled: nominateButtonDisabled,
					kind: 'primary',
					pulse: !nominateButtonDisabled,
				},
			],
		},
		{
			buttons: [
				{
					label: t('browseValidators', { ns: 'app' }),
					onClick: () => navigate('/validators'),
					kind: 'secondary',
				},
			],
		},
	]

	return <CallToActionButtons syncing={syncing} sections={sections} />
}
