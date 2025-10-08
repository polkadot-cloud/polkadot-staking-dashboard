// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { Unsub } from 'dedot/types'
import { defaultFastUnstakeConfig, setFastUnstakeConfig } from 'global-bus'
import type { FastUnstakeConfig } from 'types'
import type { FastUnstakeChain } from '../types'

export class FastUnstakeConfigQuery<T extends FastUnstakeChain> {
	erasToCheckPerBlock: number = 0
	config: FastUnstakeConfig = defaultFastUnstakeConfig

	#unsub: Unsub | undefined = undefined

	constructor(public api: DedotClient<T>) {
		this.api = api
		this.subscribe()
	}

	async subscribe() {
		this.#unsub = await this.api.queryMulti(
			[
				{
					fn: this.api.query.fastUnstake.erasToCheckPerBlock,
					args: [],
				},
				{
					fn: this.api.query.fastUnstake.head,
					args: [],
				},
				{
					fn: this.api.query.fastUnstake.counterForQueue,
					args: [],
				},
			],
			([erasToCheckPerBlock, head, counterForQueue]) => {
				const stashes = head?.stashes || []
				const checked = head?.checked || []
				this.config = {
					erasToCheckPerBlock,
					head: {
						stashes,
						checked,
					},
					counterForQueue,
				}
				setFastUnstakeConfig(this.config)
			},
		)
	}

	unsubscribe() {
		this.#unsub?.()
	}
}
