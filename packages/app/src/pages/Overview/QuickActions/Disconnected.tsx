// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
/** biome-ignore-all lint/correctness/noNestedComponentDefinitions: <> */
// SPDX-License-Identifier: GPL-3.0-only

import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LedgerSquareSVG from '@w3ux/extension-assets/LedgerSquare.svg?react'
import PolkadotVaultSVG from 'assets/brands/vault.svg?react'
import { DiscordSupportUrl, MailSupportAddress } from 'consts'
import { useTranslation } from 'react-i18next'
import { QuickAction } from 'ui-buttons'
import type { ButtonQuickActionProps } from 'ui-buttons/types'
import { useOverlay } from 'ui-overlay'

export const Disconnected = () => {
	const { t } = useTranslation()
	const { openModal } = useOverlay().modal

	const actions: ButtonQuickActionProps[] = [
		{
			onClick: () => {
				openModal({ key: 'Accounts' })
			},
			disabled: false,
			Icon: () => <FontAwesomeIcon transform="grow-2" icon={faUser} />,
			label: t('accounts', { ns: 'app' }),
		},
		{
			onClick: () => {
				openModal({
					key: 'ImportAccounts',
					size: 'sm',
					options: { source: 'ledger' },
				})
			},
			disabled: false,
			Icon: () => (
				<LedgerSquareSVG style={{ width: '1.5rem', height: '1.5rem' }} />
			),
			label: 'Ledger',
		},
		{
			onClick: () => {
				openModal({
					key: 'ImportAccounts',
					size: 'sm',
					options: { source: 'polkadot_vault' },
				})
			},
			disabled: false,
			Icon: () => (
				<PolkadotVaultSVG
					style={{
						width: '1.5rem',
						height: '1.5rem',
						fill: 'var(--text-color-primary)',
					}}
				/>
			),
			label: 'Vault',
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
