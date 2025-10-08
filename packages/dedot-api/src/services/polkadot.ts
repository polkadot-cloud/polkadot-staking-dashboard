// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PolkadotAssetHubApi } from '@dedot/chaintypes'
import type { PolkadotApi } from '@dedot/chaintypes/polkadot'
import type { PolkadotPeopleApi } from '@dedot/chaintypes/polkadot-people'
import { type DedotClient, ExtraSignedExtension } from 'dedot'
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

export class PolkadotService
	extends BaseService<
		PolkadotApi, // Relay Chain
		PolkadotPeopleApi, // People Chain
		PolkadotAssetHubApi, // Asset Hub Chain
		PolkadotApi, // Chain for staking
		PolkadotApi // Chain for fast unstake
	>
	implements
		DefaultServiceClass<
			PolkadotApi, // Relay Chain
			PolkadotPeopleApi, // People Chain
			PolkadotAssetHubApi, // Asset Hub Chain
			PolkadotApi, // Chain for staking
			PolkadotApi // Chain for fast unstake
		>
{
	// Service interface
	interface: ServiceInterface

	constructor(
		public networkConfig: NetworkConfig,
		public ids: [NetworkId, SystemChainId, SystemChainId],
		public apiRelay: DedotClient<PolkadotApi>,
		public apiPeople: DedotClient<PolkadotPeopleApi>,
		public apiHub: DedotClient<PolkadotAssetHubApi>,
	) {
		// For Polkadot, staking happens on the relay chain, and fast unstake on the relay chain
		super(networkConfig, ids, apiRelay, apiPeople, apiHub, apiRelay, apiRelay)

		// For Polkadot, fast unstake happens on the relay chain
		this.fastUnstakeConsts = new FastUnstakeConsts(this.apiRelay)
		this.fastUnstakeConfig = new FastUnstakeConfigQuery(this.apiRelay)

		// Initialize service interface with network-specific routing
		this.interface = {
			query: {
				erasValidatorRewardMulti: async (eras) =>
					await query.erasValidatorRewardMulti(this.apiRelay, eras),
				bondedPool: async (poolId) =>
					await query.bondedPool(this.apiRelay, poolId),
				bondedPoolEntries: async () =>
					await query.bondedPoolEntries(this.apiRelay),
				erasStakersOverviewEntries: async (era) =>
					await query.erasStakersOverviewEntries(this.apiRelay, era),
				erasStakersPagedEntries: async (era, validator) =>
					await query.erasStakersPagedEntries(this.apiRelay, era, validator),
				identityOfMulti: async (addresses) =>
					await query.identityOfMulti(this.apiPeople, addresses),
				nominatorsMulti: async (addresses) =>
					await query.nominatorsMulti(this.apiRelay, addresses),
				poolMembersMulti: async (addresses) =>
					await query.poolMembersMulti(this.apiRelay, addresses),
				poolMetadataMulti: async (poolIds) =>
					await query.poolMetadataMulti(this.apiRelay, poolIds),
				proxies: async (address) => await query.proxies(this.apiRelay, address),
				sessionValidators: async () =>
					await query.sessionValidators(this.apiRelay),
				superOfMulti: async (addresses) =>
					await query.superOfMulti(
						this.apiPeople,
						addresses,
						this.apiPeople.consts.system.ss58Prefix,
					),
				validatorEntries: async () =>
					await query.validatorEntries(this.apiRelay),
				validatorsMulti: async (addresses) =>
					await query.validatorsMulti(this.apiRelay, addresses),
			},
			runtimeApi: {
				balanceToPoints: async (poolId, amount) =>
					await runtimeApi.balanceToPoints(this.apiRelay, poolId, amount),
				pendingRewards: async (address) =>
					await runtimeApi.pendingRewards(this.apiRelay, address),
				pointsToBalance: async (poolId, points) =>
					await runtimeApi.pointsToBalance(this.apiRelay, poolId, points),
			},
			tx: {
				batch: (calls) => tx.batch(this.apiRelay, calls),
				createPool: (from, poolId, bond, metadata, nominees, roles) =>
					createPool(
						this.apiRelay,
						from,
						poolId,
						bond,
						metadata,
						nominees,
						roles,
					),
				fastUnstakeDeregister: () => tx.fastUnstakeDeregister(this.apiRelay),
				fastUnstakeRegister: () => tx.fastUnstakeRegister(this.apiRelay),
				joinPool: (poolId, bond, claimPermission) =>
					tx.joinPool(this.apiRelay, poolId, bond, claimPermission),
				newNominator: (bond, payee, nominees) =>
					tx.newNominator(this.apiRelay, bond, payee, nominees),
				payoutStakersByPage: (validator, era, page) =>
					tx.payoutStakersByPage(this.apiRelay, validator, era, page),
				poolBondExtra: (type, bond) =>
					tx.poolBondExtra(this.apiRelay, type, bond),
				poolChill: (poolId) => tx.poolChill(this.apiRelay, poolId),
				poolClaimCommission: (poolId) =>
					tx.poolClaimCommission(this.apiRelay, poolId),
				poolClaimPayout: () => tx.poolClaimPayout(this.apiRelay),
				poolNominate: (poolId, nominees) =>
					tx.poolNominate(this.apiRelay, poolId, nominees),
				poolSetClaimPermission: (claimPermission) =>
					tx.poolSetClaimPermission(this.apiRelay, claimPermission),
				poolSetCommission: (poolId, commission) =>
					tx.poolSetCommission(this.apiRelay, poolId, commission),
				poolSetCommissionChangeRate: (poolId, maxIncrease, minDelay) =>
					tx.poolSetCommissionChangeRate(
						this.apiRelay,
						poolId,
						maxIncrease,
						minDelay,
					),
				poolSetCommissionMax: (poolId, max) =>
					tx.poolSetCommissionMax(this.apiRelay, poolId, max),
				poolSetMetadata: (poolId, metadata) =>
					tx.poolSetMetadata(this.apiRelay, poolId, metadata),
				poolSetState: (poolId, state) =>
					tx.poolSetState(this.apiRelay, poolId, state),
				poolUnbond: (who, points) => tx.poolUnbond(this.apiRelay, who, points),
				poolUpdateRoles: (poolId, roles) =>
					tx.poolUpdateRoles(this.apiRelay, poolId, roles),
				poolWithdraw: (who, numSlashingSpans) =>
					tx.poolWithdraw(this.apiRelay, who, numSlashingSpans),
				proxy: (real, call) => tx.proxy(this.apiRelay, real, call),
				setController: () => tx.setController(this.apiRelay),
				stakingBondExtra: (bond) => tx.stakingBondExtra(this.apiRelay, bond),
				stakingChill: () => tx.stakingChill(this.apiRelay),
				stakingNominate: (nominees) =>
					tx.stakingNominate(this.apiRelay, nominees),
				stakingRebond: (bond) => tx.stakingRebond(this.apiRelay, bond),
				stakingSetPayee: (payee) => tx.stakingSetPayee(this.apiRelay, payee),
				stakingUnbond: (bond) => tx.stakingUnbond(this.apiRelay, bond),
				stakingWithdraw: (numSlashingSpans) =>
					tx.stakingWithdraw(this.apiRelay, numSlashingSpans),
				transferKeepAlive: (to, value) =>
					tx.transferKeepAlive(this.apiRelay, to, value),
			},
			signer: {
				extraSignedExtension: (
					specName,
					signerAddress,
					payloadOptions = undefined,
				) =>
					new ExtraSignedExtension(this.getApi(specName), {
						signerAddress,
						payloadOptions,
					}),
				metadata: async (specName) =>
					await this.getApi(specName).call.metadata.metadataAtVersion(15),
			},
			spec: {
				ss58: (specName) => this.getApi(specName).consts.system.ss58Prefix,
			},
			codec: {
				$Signature: (specName) =>
					this.getApi(specName).registry.findCodec(
						this.getApi(specName).registry.metadata.extrinsic.signatureTypeId,
					),
			},
		}
	}

	async start() {
		await super.start(this.interface)
	}
}
