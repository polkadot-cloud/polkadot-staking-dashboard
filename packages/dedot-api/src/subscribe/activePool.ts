// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { withTimeout } from '@w3ux/utils'
import type { DedotClient } from 'dedot'
import type { Unsub } from 'dedot/types'
import { addActivePool, removeActivePool } from 'global-bus'
import type { ActivePool, IdentityOf, ServiceInterface, SuperOf } from 'types'
import {
	createPoolAccounts,
	formatIdentities,
	formatSuperIdentities,
} from 'utils'
import type { StakingChain } from '../types'

export class ActivePoolQuery<T extends StakingChain> {
	#unsub: Unsub | undefined = undefined

	constructor(
		public api: DedotClient<T>,
		public poolId: number,
		public poolsPalletId: Uint8Array,
		public serviceInterface: ServiceInterface,
	) {
		this.api = api
		this.subscribe()
	}

	async subscribe() {
		const { stash, reward } = createPoolAccounts(
			this.poolId,
			this.poolsPalletId,
			this.api.consts.system.ss58Prefix,
		)

		this.#unsub = await this.api.queryMulti(
			[
				{
					fn: this.api.query.nominationPools.bondedPools,
					args: [this.poolId],
				},
				{
					fn: this.api.query.nominationPools.rewardPools,
					args: [this.poolId],
				},
				{
					fn: this.api.query.system.account,
					args: [reward],
				},
				{
					fn: this.api.query.staking.nominators,
					args: [stash],
				},
			],
			async ([bondedPool, rewardPool, rewardAccount, nominators]) => {
				if (bondedPool && rewardPool) {
					const { targets, submittedIn } = nominators || {
						targets: [],
						submittedIn: 0,
					}
					const roleAddresses = Object.values(bondedPool.roles).map((role) =>
						role.address(this.api.consts.system.ss58Prefix),
					)

					// NODE: Ideally be added to a queue for the people chain to fetch asynchronously
					const identities = (await withTimeout(
						500,
						Promise.all([
							this.serviceInterface.query.identityOfMulti(roleAddresses),
							this.serviceInterface.query.superOfMulti(roleAddresses),
						]),
					)) as [IdentityOf[], SuperOf[]]

					const activePool: ActivePool = {
						id: this.poolId,
						addresses: { stash, reward },
						bondedPool: {
							points: bondedPool.points,
							memberCounter: bondedPool.memberCounter,
							roles: {
								depositor: bondedPool.roles.depositor.address(
									this.api.consts.system.ss58Prefix,
								),
								nominator: bondedPool.roles.nominator?.address(
									this.api.consts.system.ss58Prefix,
								),
								root: bondedPool.roles.root?.address(
									this.api.consts.system.ss58Prefix,
								),
								bouncer: bondedPool.roles.bouncer?.address(
									this.api.consts.system.ss58Prefix,
								),
							},
							roleIdentities: {
								identities: formatIdentities(
									roleAddresses,
									identities?.[0] || [],
								),
								supers: formatSuperIdentities(identities?.[1] || []),
							},
							state: bondedPool.state,
						},
						rewardPool: {
							lastRecordedRewardCounter: rewardPool.lastRecordedRewardCounter,
							lastRecordedTotalPayouts: rewardPool.lastRecordedTotalPayouts,
							totalCommissionClaimed: rewardPool.totalCommissionClaimed,
							totalCommissionPending: rewardPool.totalCommissionPending,
							totalRewardsClaimed: rewardPool.totalRewardsClaimed,
						},
						rewardAccountBalance: rewardAccount.data.free,
						nominators: {
							targets: targets.map((target) =>
								target.address(this.api.consts.system.ss58Prefix),
							),
							submittedIn,
						},
					}
					addActivePool(activePool)
				} else {
					removeActivePool(this.poolId)
				}
			},
		)
	}

	unsubscribe() {
		this.#unsub?.()
		removeActivePool(this.poolId)
	}
}
