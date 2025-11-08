// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue } from '@w3ux/utils'
import { useNetwork } from 'contexts/Network'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import {
	acknowledgeLocalInvite,
	getLocalInviteConfig,
	removeLocalInviteConfig,
	setLocalInviteConfig,
} from './local'
import type { InviteConfig, InvitesContextInterface, InviteType } from './types'

export const InvitesContext = createContext<InvitesContextInterface>(
	{} as InvitesContextInterface,
)

export const InvitesProvider = ({ children }: { children: ReactNode }) => {
	const { network } = useNetwork()

	// State for tracking invite status
	const [inviteConfig, setInviteConfig] = useState<InviteConfig | undefined>(
		getLocalInviteConfig(),
	)

	// Whether the invite has been acknowledged
	const [acknowledged, setAcknowledgedState] = useState<boolean>(
		getLocalInviteConfig()?.acknowledged || true,
	)

	// Setter for acknowledged state that also updates local storage
	const setAcknowledged = (ack: boolean) => {
		acknowledgeLocalInvite(ack)
		setAcknowledgedState(ack)
	}

	// Function to dismiss the invite notification
	const dismissInvite = () => {
		setInviteConfig(undefined)
		removeLocalInviteConfig()
	}

	// Set invite data when the page loads
	useEffect(() => {
		const idFromUrl = extractUrlValue('id')
		if (extractUrlValue('i') === 'pool' && !isNaN(Number(idFromUrl))) {
			const type: InviteType = 'pool'
			const invite = {
				type,
				network,
				invite: {
					poolId: Number(idFromUrl),
				},
			}
			setLocalInviteConfig({
				...invite,
				acknowledged: false,
			})
			setInviteConfig(invite)
			setAcknowledged(false)
		}
	}, [])

	return (
		<InvitesContext.Provider
			value={{
				dismissInvite,
				acknowledged,
				setAcknowledged,
				inviteConfig,
			}}
		>
			{children}
		</InvitesContext.Provider>
	)
}

export const useInvites = () => useContext(InvitesContext)
