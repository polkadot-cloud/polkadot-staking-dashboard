// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { FastUnstakeChain } from '../types'

export class FastUnstakeConsts<T extends FastUnstakeChain> {
	fastUnstakeDeposit: bigint

	constructor(public api: DedotClient<T>) {
		this.api = api
		this.fetch()
	}

	fetch() {
		this.fastUnstakeDeposit = this.api.consts.fastUnstake.deposit
	}

	get() {
		return {
			fastUnstakeDeposit: this.fastUnstakeDeposit,
		}
	}
}
