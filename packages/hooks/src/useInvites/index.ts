// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue } from '@w3ux/utils'
import { useCallback, useEffect, useSyncExternalStore } from 'react'
import type { NetworkId } from 'types'
import { useNetwork } from '../useNetwork'
import {
	acknowledgeLocalInvite,
	getLocalInviteConfig,
	removeLocalInviteConfig,
	setLocalInviteConfig,
} from './local'
import type {
	InviteConfig,
	InvitesHookInterface,
	InviteType,
	LocalInviteConfig,
} from './types'

export type {
	InviteConfig,
	InvitesHookInterface,
	InviteType,
	LocalInviteConfig,
	PoolInvite,
} from './types'

type InvitesState = {
	acknowledged: boolean
	inviteConfig: InviteConfig | undefined
}

const listeners = new Set<() => void>()
let inviteUrlSynced = false

const toInviteConfig = ({
	acknowledged: _acknowledged,
	...inviteConfig
}: LocalInviteConfig): InviteConfig => inviteConfig

const getInitialInvitesState = (): InvitesState => {
	const localInvite = getLocalInviteConfig()
	return {
		acknowledged: localInvite?.acknowledged ?? true,
		inviteConfig: localInvite ? toInviteConfig(localInvite) : undefined,
	}
}

let currentInvitesState = getInitialInvitesState()

const emitInvitesChange = () => {
	for (const listener of listeners) {
		listener()
	}
}

const getInvitesSnapshot = () => currentInvitesState

const setInvitesState = (state: InvitesState) => {
	currentInvitesState = state
	emitInvitesChange()
}

const syncInviteFromUrl = (network: NetworkId) => {
	if (inviteUrlSynced) {
		return
	}
	inviteUrlSynced = true

	const idFromUrl = extractUrlValue('id')
	if (extractUrlValue('i') === 'pool' && !isNaN(Number(idFromUrl))) {
		const type: InviteType = 'pool'
		const inviteConfig: InviteConfig = {
			type,
			network,
			invite: {
				poolId: Number(idFromUrl),
			},
		}
		setLocalInviteConfig({
			...inviteConfig,
			acknowledged: false,
		})
		setInvitesState({
			acknowledged: false,
			inviteConfig,
		})
	}
}

const subscribeInvites = (listener: () => void) => {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}
}

const serverInvitesSnapshot: InvitesState = {
	acknowledged: true,
	inviteConfig: undefined,
}

export const useInvites = (): InvitesHookInterface => {
	const { network } = useNetwork()
	const { acknowledged, inviteConfig } = useSyncExternalStore(
		subscribeInvites,
		getInvitesSnapshot,
		() => serverInvitesSnapshot,
	)

	useEffect(() => {
		syncInviteFromUrl(network)
	}, [network])

	const setAcknowledged = useCallback((ack: boolean) => {
		acknowledgeLocalInvite(ack)
		setInvitesState({
			...getInvitesSnapshot(),
			acknowledged: ack,
		})
	}, [])

	const dismissInvite = useCallback(() => {
		removeLocalInviteConfig()
		setInvitesState({
			...getInvitesSnapshot(),
			inviteConfig: undefined,
		})
	}, [])

	return {
		dismissInvite,
		acknowledged,
		setAcknowledged,
		inviteConfig,
	}
}
