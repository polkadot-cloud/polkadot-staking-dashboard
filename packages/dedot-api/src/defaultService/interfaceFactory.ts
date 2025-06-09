// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ExtraSignedExtension, type DedotClient } from 'dedot'
import type { ServiceInterface } from 'types'
import { query } from '../query'
import { runtimeApi } from '../runtimeApi'
import { tx } from '../tx'
import { createPool } from '../tx/createPool'
import type {
  AssetHubChain,
  PeopleChain,
  RelayChain,
  StakingChain,
} from '../types'
import type { ChainConfig } from './chainConfig'
import { getApiForOperation } from './chainConfig'

/**
 * Creates a ServiceInterface implementation based on chain configuration
 */
export const createServiceInterface = <
  RelayApi extends RelayChain,
  PeopleApi extends PeopleChain,
  HubApi extends AssetHubChain,
  StakingApi extends StakingChain,
>(
  apiRelay: DedotClient<RelayApi>,
  apiPeople: DedotClient<PeopleApi>,
  apiHub: DedotClient<HubApi>,
  ids: [string, string, string],
  chainConfig: ChainConfig<RelayApi, PeopleApi, HubApi, StakingApi>,
  getApi: (
    id: string
  ) => DedotClient<RelayApi> | DedotClient<PeopleApi> | DedotClient<HubApi>
): ServiceInterface => ({
  query: {
    erasValidatorRewardMulti: async (eras) =>
      await query.erasValidatorRewardMulti(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.erasValidatorRewardMulti
        ) as any,
        eras
      ),
    bondedPool: async (poolId) =>
      await query.bondedPool(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.bondedPool
        ) as any,
        poolId
      ),
    bondedPoolEntries: async () =>
      await query.bondedPoolEntries(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.bondedPoolEntries
        ) as any
      ),
    erasStakersOverviewEntries: async (era) =>
      await query.erasStakersOverviewEntries(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.erasStakersOverviewEntries
        ) as any,
        era
      ),
    erasStakersPagedEntries: async (era, validator) =>
      await query.erasStakersPagedEntries(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.erasStakersPagedEntries
        ) as any,
        era,
        validator
      ),
    identityOfMulti: async (addresses) =>
      await query.identityOfMulti(apiPeople as any, addresses),
    nominatorsMulti: async (addresses) =>
      await query.nominatorsMulti(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.nominatorsMulti
        ) as any,
        addresses
      ),
    poolMembersMulti: async (addresses) =>
      await query.poolMembersMulti(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.poolMembersMulti
        ) as any,
        addresses
      ),
    poolMetadataMulti: async (poolIds) =>
      await query.poolMetadataMulti(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.poolMetadataMulti
        ) as any,
        poolIds
      ),
    proxies: async (address) =>
      await query.proxies(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.proxies
        ) as any,
        address
      ),
    sessionValidators: async () =>
      await query.sessionValidators(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.sessionValidators
        ) as any
      ),
    superOfMulti: async (addresses) =>
      await query.superOfMulti(
        apiPeople as any,
        addresses,
        (apiPeople as any).consts.system.ss58Prefix
      ),
    validatorEntries: async () =>
      await query.validatorEntries(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.validatorEntries
        ) as any
      ),
    validatorsMulti: async (addresses) =>
      await query.validatorsMulti(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.validatorsMulti
        ) as any,
        addresses
      ),
  },
  runtimeApi: {
    balanceToPoints: async (poolId, amount) =>
      await runtimeApi.balanceToPoints(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.runtimeApis.balanceToPoints
        ) as any,
        poolId,
        amount
      ),
    pendingRewards: async (address) =>
      await runtimeApi.pendingRewards(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.runtimeApis.pendingRewards
        ) as any,
        address
      ),
    pointsToBalance: async (poolId, points) =>
      await runtimeApi.pointsToBalance(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.runtimeApis.pointsToBalance
        ) as any,
        poolId,
        points
      ),
  },
  tx: {
    batch: (calls) =>
      tx.batch(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.batch
        ) as any,
        calls
      ),
    createPool: (from, poolId, bond, metadata, nominees, roles) =>
      createPool(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.createPool
        ) as any,
        from,
        poolId,
        bond,
        metadata,
        nominees,
        roles
      ),
    fastUnstakeDeregister: () =>
      tx.fastUnstakeDeregister(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.fastUnstakeDeregister
        ) as any
      ),
    fastUnstakeRegister: () =>
      tx.fastUnstakeRegister(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.fastUnstakeRegister
        ) as any
      ),
    joinPool: (poolId, bond, claimPermission) =>
      tx.joinPool(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.joinPool
        ) as any,
        poolId,
        bond,
        claimPermission
      ),
    newNominator: (bond, payee, nominees) =>
      tx.newNominator(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.newNominator
        ) as any,
        bond,
        payee,
        nominees
      ),
    payoutStakersByPage: (validator, era, page) =>
      tx.payoutStakersByPage(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.payoutStakersByPage
        ) as any,
        validator,
        era,
        page
      ),
    poolBondExtra: (type, bond) =>
      tx.poolBondExtra(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.poolBondExtra
        ) as any,
        type,
        bond
      ),
    poolChill: (poolId) =>
      tx.poolChill(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.poolChill
        ) as any,
        poolId
      ),
    poolClaimCommission: (poolId) =>
      tx.poolClaimCommission(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.poolClaimCommission
        ) as any,
        poolId
      ),
    poolClaimPayout: () =>
      tx.poolClaimPayout(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.poolClaimPayout
        ) as any
      ),
    poolNominate: (poolId, nominees) =>
      tx.poolNominate(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.poolNominate
        ) as any,
        poolId,
        nominees
      ),
    poolSetClaimPermission: (claimPermission) =>
      tx.poolSetClaimPermission(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.poolSetClaimPermission
        ) as any,
        claimPermission
      ),
    poolSetCommission: (poolId, commission) =>
      tx.poolSetCommission(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.poolSetCommission
        ) as any,
        poolId,
        commission
      ),
    poolSetCommissionChangeRate: (poolId, maxIncrease, minDelay) =>
      tx.poolSetCommissionChangeRate(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.poolSetCommissionChangeRate
        ) as any,
        poolId,
        maxIncrease,
        minDelay
      ),
    poolSetCommissionMax: (poolId, max) =>
      tx.poolSetCommissionMax(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.poolSetCommissionMax
        ) as any,
        poolId,
        max
      ),
    poolSetMetadata: (poolId, metadata) =>
      tx.poolSetMetadata(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.poolSetMetadata
        ) as any,
        poolId,
        metadata
      ),
    poolSetState: (poolId, state) =>
      tx.poolSetState(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.poolSetState
        ) as any,
        poolId,
        state
      ),
    poolUnbond: (who, points) =>
      tx.poolUnbond(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.poolUnbond
        ) as any,
        who,
        points
      ),
    poolUpdateRoles: (poolId, roles) =>
      tx.poolUpdateRoles(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.poolUpdateRoles
        ) as any,
        poolId,
        roles
      ),
    poolWithdraw: (who, numSlashingSpans) =>
      tx.poolWithdraw(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.poolWithdraw
        ) as any,
        who,
        numSlashingSpans
      ),
    proxy: (real, call) =>
      tx.proxy(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.proxy
        ) as any,
        real,
        call
      ),
    setController: () =>
      tx.setController(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.setController
        ) as any
      ),
    stakingBondExtra: (bond) =>
      tx.stakingBondExtra(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.stakingBondExtra
        ) as any,
        bond
      ),
    stakingChill: () =>
      tx.stakingChill(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.stakingChill
        ) as any
      ),
    stakingNominate: (nominees) =>
      tx.stakingNominate(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.stakingNominate
        ) as any,
        nominees
      ),
    stakingRebond: (bond) =>
      tx.stakingRebond(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.stakingRebond
        ) as any,
        bond
      ),
    stakingSetPayee: (payee) =>
      tx.stakingSetPayee(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.stakingSetPayee
        ) as any,
        payee
      ),
    stakingUnbond: (bond) =>
      tx.stakingUnbond(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.stakingUnbond
        ) as any,
        bond
      ),
    stakingWithdraw: (numSlashingSpans) =>
      tx.stakingWithdraw(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.stakingWithdraw
        ) as any,
        numSlashingSpans
      ),
    transferKeepAlive: (to, value) =>
      tx.transferKeepAlive(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.transferKeepAlive
        ) as any,
        to,
        value
      ),
  },
  signer: {
    extraSignedExtension: (
      specName,
      signerAddress,
      payloadOptions = undefined
    ) =>
      new ExtraSignedExtension(getApi(specName) as any, {
        signerAddress,
        payloadOptions,
      }),
    metadata: async (specName) =>
      await (getApi(specName) as any).call.metadata.metadataAtVersion(15),
  },
  spec: {
    ss58: (specName) => (getApi(specName) as any).consts.system.ss58Prefix,
  },
  codec: {
    $Signature: (specName) =>
      (getApi(specName) as any).registry.findCodec(
        (getApi(specName) as any).registry.metadata.extrinsic.signatureTypeId
      ),
  },
})
