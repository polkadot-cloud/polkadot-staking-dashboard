// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { WestendAssetHubApi } from '@dedot/chaintypes'
import type { WestendApi } from '@dedot/chaintypes/westend'
import type { WestendPeopleApi } from '@dedot/chaintypes/westend-people'
import {
	type DedotClient,
	ExtraSignedExtension,
	type SmoldotProvider,
	type WsProvider,
} from 'dedot'
import type {
	NetworkConfig,
	NetworkId,
	ServiceInterface,
	SystemChainId,
} from 'types'
import { FastUnstakeConsts } from '../consts/fastUnstake'
import { BaseService } from '../defaultService/baseService'
import type { DefaultServiceClass } from '../defaultService/types'
import { query } from '../query'
import { runtimeApi } from '../runtimeApi'
import { FastUnstakeConfigQuery } from '../subscribe/fastUnstakeConfig'
import { tx } from '../tx'
import { createPool } from '../tx/createPool'

export class WestendService
	extends BaseService<
		WestendApi, // Relay Chain
		WestendPeopleApi, // People Chain
		WestendAssetHubApi, // Asset Hub Chain
		WestendAssetHubApi, // Chain for staking
		WestendAssetHubApi // Chain for fast unstake
	>
	implements
		DefaultServiceClass<
			WestendApi, // Relay Chain
			WestendPeopleApi, // People Chain
			WestendAssetHubApi, // Asset Hub Chain
			WestendAssetHubApi, // Chain for staking
			WestendAssetHubApi // Chain for fast unstake
		>
{
	// Service interface
	interface: ServiceInterface

	constructor(
		public networkConfig: NetworkConfig,
		public ids: [NetworkId, SystemChainId, SystemChainId],
		public apiRelay: DedotClient<WestendApi>,
		public apiPeople: DedotClient<WestendPeopleApi>,
		public apiHub: DedotClient<WestendAssetHubApi>,
		public providerPeople: WsProvider | SmoldotProvider,
	) {
		// For Westend, staking happens on the hub chain, and fast unstake on the hub chain
		super(
			networkConfig,
			ids,
			apiRelay,
			apiPeople,
			apiHub,
			apiHub,
			apiHub,
			providerPeople,
		)

		// For Westend, fast unstake happens on the asset hub chain
		this.fastUnstakeConsts = new FastUnstakeConsts(this.apiHub)
		this.fastUnstakeConfig = new FastUnstakeConfigQuery(this.apiHub)

		// Initialize service interface with network-specific routing
		this.interface = {
			query: {
				erasValidatorRewardMulti: async (eras) =>
					await query.erasValidatorRewardMulti(this.apiHub, eras),
				bondedPool: async (poolId) =>
					await query.bondedPool(this.apiHub, poolId),
				bondedPoolEntries: async () =>
					await query.bondedPoolEntries(this.apiHub),
				erasStakersOverviewEntries: async (era) =>
					await query.erasStakersOverviewEntries(this.apiHub, era),
				erasStakersPagedEntries: async (era, validator) =>
					await query.erasStakersPagedEntries(this.apiHub, era, validator),
				nominatorsMulti: async (addresses) =>
					await query.nominatorsMulti(this.apiHub, addresses),
				poolMembersMulti: async (addresses) =>
					await query.poolMembersMulti(this.apiHub, addresses),
				poolMetadataMulti: async (poolIds) =>
					await query.poolMetadataMulti(this.apiHub, poolIds),
				proxies: async (address) => await query.proxies(this.apiHub, address),
				sessionValidators: async () =>
					await query.sessionValidators(this.apiHub),
				identityOfMulti: async (addresses) =>
					await this.identityManager.identityOfMulti(addresses),
				superOfMulti: async (addresses) =>
					await this.identityManager.superOfMulti(addresses),
				validatorEntries: async () => await query.validatorEntries(this.apiHub),
				validatorsMulti: async (addresses) =>
					await query.validatorsMulti(this.apiHub, addresses),
			},
			runtimeApi: {
				balanceToPoints: async (poolId, amount) =>
					await runtimeApi.balanceToPoints(this.apiHub, poolId, amount),
				pendingRewards: async (address) =>
					await runtimeApi.pendingRewards(this.apiHub, address),
				pointsToBalance: async (poolId, points) =>
					await runtimeApi.pointsToBalance(this.apiHub, poolId, points),
			},
			tx: {
				batch: (calls) => tx.batch(this.apiHub, calls),
				createPool: (from, poolId, bond, metadata, nominees, roles) =>
					createPool(
						this.apiHub,
						from,
						poolId,
						bond,
						metadata,
						nominees,
						roles,
					),
				fastUnstakeDeregister: () => tx.fastUnstakeDeregister(this.apiHub),
				fastUnstakeRegister: () => tx.fastUnstakeRegister(this.apiHub),
				joinPool: (poolId, bond, claimPermission) =>
					tx.joinPool(this.apiHub, poolId, bond, claimPermission),
				newNominator: (bond, payee, nominees) =>
					tx.newNominator(this.apiHub, bond, payee, nominees),
				payoutStakersByPage: (validator, era, page) =>
					tx.payoutStakersByPage(this.apiHub, validator, era, page),
				poolBondExtra: (type, bond) =>
					tx.poolBondExtra(this.apiHub, type, bond),
				poolChill: (poolId) => tx.poolChill(this.apiHub, poolId),
				poolClaimCommission: (poolId) =>
					tx.poolClaimCommission(this.apiHub, poolId),
				poolClaimPayout: () => tx.poolClaimPayout(this.apiHub),
				poolNominate: (poolId, nominees) =>
					tx.poolNominate(this.apiHub, poolId, nominees),
				poolSetClaimPermission: (claimPermission) =>
					tx.poolSetClaimPermission(this.apiHub, claimPermission),
				poolSetCommission: (poolId, commission) =>
					tx.poolSetCommission(this.apiHub, poolId, commission),
				poolSetCommissionChangeRate: (poolId, maxIncrease, minDelay) =>
					tx.poolSetCommissionChangeRate(
						this.apiHub,
						poolId,
						maxIncrease,
						minDelay,
					),
				poolSetCommissionMax: (poolId, max) =>
					tx.poolSetCommissionMax(this.apiHub, poolId, max),
				poolSetMetadata: (poolId, metadata) =>
					tx.poolSetMetadata(this.apiHub, poolId, metadata),
				poolSetState: (poolId, state) =>
					tx.poolSetState(this.apiHub, poolId, state),
				poolUnbond: (who, points) => tx.poolUnbond(this.apiHub, who, points),
				poolUpdateRoles: (poolId, roles) =>
					tx.poolUpdateRoles(this.apiHub, poolId, roles),
				poolWithdraw: (who, numSlashingSpans) =>
					tx.poolWithdraw(this.apiHub, who, numSlashingSpans),
				proxy: (real, call) => tx.proxy(this.apiHub, real, call),
				setController: () => tx.setController(this.apiHub),
				stakingBondExtra: (bond) => tx.stakingBondExtra(this.apiHub, bond),
				stakingChill: () => tx.stakingChill(this.apiHub),
				stakingNominate: (nominees) =>
					tx.stakingNominate(this.apiHub, nominees),
				stakingRebond: (bond) => tx.stakingRebond(this.apiHub, bond),
				stakingSetPayee: (payee) => tx.stakingSetPayee(this.apiHub, payee),
				stakingUnbond: (bond) => tx.stakingUnbond(this.apiHub, bond),
				stakingWithdraw: (numSlashingSpans) =>
					tx.stakingWithdraw(this.apiHub, numSlashingSpans),
				transferKeepAlive: (to, value) =>
					tx.transferKeepAlive(this.apiHub, to, value),
			},
			signer: {
				extraSignedExtension: (
					specName,
					signerAddress,
					payloadOptions = undefined,
				) =>
					new ExtraSignedExtension(this.getLiveApi(specName), {
						signerAddress,
						payloadOptions,
					}),
				metadata: async (specName) =>
					await this.getLiveApi(specName).call.metadata.metadataAtVersion(15),
			},
			spec: {
				ss58: (specName) => this.getLiveApi(specName).consts.system.ss58Prefix,
			},
			codec: {
				$Signature: (specName) =>
					this.getLiveApi(specName).registry.findCodec(
						this.getLiveApi(specName).registry.metadata.extrinsic
							.signatureTypeId,
					),
			},
		}
	}

	async start() {
		await super.start(this.interface)
	}
}
