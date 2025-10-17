// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { DedotClient, type SmoldotProvider, type WsProvider } from 'dedot'
import { query } from '../query'
import type { PeopleChain } from '../types'

// Manages lazy identity connection and people chain interactions
export class IdentityManager<PeopleApi extends PeopleChain> {
	provider: WsProvider | SmoldotProvider
	api: DedotClient<PeopleApi>

	constructor(provider: WsProvider | SmoldotProvider) {
		this.provider = provider
	}

	identityOfMulti = async (addresses: string[]) => {
		await this.lazyConnect()
		return await query.identityOfMulti(this.api, addresses)
	}

	superOfMulti = async (addresses: string[]) => {
		await this.lazyConnect()
		return await query.superOfMulti(
			this.api,
			addresses,
			this.api.consts.system.ss58Prefix,
		)
	}

	// Lazy connect to the people chain API. Should be called before any queries
	lazyConnect = async () => {
		if (!this.api) {
			this.api = await DedotClient.new<PeopleApi>(this.provider)
		}
	}
}
