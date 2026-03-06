// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
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
import { useOverlay } from 'ui-overlay'
import type { NewNominatorProps } from '../types'

export const NewNominator = ({ syncing }: NewNominatorProps) => {
	const { t } = useTranslation()
	const { isReady } = useApi()
	const { network } = useNetwork()
	const { openModal } = useOverlay().modal
	const { activeAddress } = useActiveAccounts()
	const { isBonding, isNominating } = useStaking()
	const { isReadOnlyAccount } = useImportedAccounts()

	const nominateButtonDisabled =
		!isReady ||
		!activeAddress ||
		isNominating ||
		isBonding ||
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
	]

	return <CallToActionButtons syncing={syncing} sections={sections} />
}
