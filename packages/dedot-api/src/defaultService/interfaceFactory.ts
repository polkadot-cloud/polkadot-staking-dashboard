// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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
        ),
        eras
      ),
    bondedPool: async (poolId) =>
      await query.bondedPool(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.bondedPool
        ),
        poolId
      ),
    bondedPoolEntries: async () =>
      await query.bondedPoolEntries(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.bondedPoolEntries
        )
      ),
    erasStakersOverviewEntries: async (era) =>
      await query.erasStakersOverviewEntries(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.erasStakersOverviewEntries
        ),
        era
      ),
    erasStakersPagedEntries: async (era, validator) =>
      await query.erasStakersPagedEntries(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.erasStakersPagedEntries
        ),
        era,
        validator
      ),
    identityOfMulti: async (addresses) =>
      await query.identityOfMulti(apiPeople, addresses),
    nominatorsMulti: async (addresses) =>
      await query.nominatorsMulti(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.nominatorsMulti
        ),
        addresses
      ),
    poolMembersMulti: async (addresses) =>
      await query.poolMembersMulti(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.poolMembersMulti
        ),
        addresses
      ),
    poolMetadataMulti: async (poolIds) =>
      await query.poolMetadataMulti(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.poolMetadataMulti
        ),
        poolIds
      ),
    proxies: async (address) =>
      await query.proxies(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.proxies
        ),
        address
      ),
    sessionValidators: async () =>
      await query.sessionValidators(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.sessionValidators
        )
      ),
    superOfMulti: async (addresses) =>
      await query.superOfMulti(
        apiPeople,
        addresses,
        apiPeople.consts.system.ss58Prefix
      ),
    validatorEntries: async () =>
      await query.validatorEntries(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.validatorEntries
        )
      ),
    validatorsMulti: async (addresses) =>
      await query.validatorsMulti(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.queryApis.validatorsMulti
        ),
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
        ),
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
        ),
        address
      ),
    pointsToBalance: async (poolId, points) =>
      await runtimeApi.pointsToBalance(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.runtimeApis.pointsToBalance
        ),
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
        ),
        calls
      ),
    createPool: (from, poolId, bond, metadata, nominees, roles) =>
      createPool(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.createPool
        ),
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
        )
      ),
    fastUnstakeRegister: () =>
      tx.fastUnstakeRegister(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.fastUnstakeRegister
        )
      ),
    joinPool: (poolId, bond, claimPermission) =>
      tx.joinPool(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.joinPool
        ),
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
        ),
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
        ),
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
        ),
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
        ),
        poolId
      ),
    poolClaimCommission: (poolId) =>
      tx.poolClaimCommission(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.poolClaimCommission
        ),
        poolId
      ),
    poolClaimPayout: () =>
      tx.poolClaimPayout(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.poolClaimPayout
        )
      ),
    poolNominate: (poolId, nominees) =>
      tx.poolNominate(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.poolNominate
        ),
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
        ),
        claimPermission
      ),
    poolSetCommission: (poolId, commission) =>
      tx.poolSetCommission(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.poolSetCommission
        ),
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
        ),
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
        ),
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
        ),
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
        ),
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
        ),
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
        ),
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
        ),
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
        ),
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
        )
      ),
    stakingBondExtra: (bond) =>
      tx.stakingBondExtra(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.stakingBondExtra
        ),
        bond
      ),
    stakingChill: () =>
      tx.stakingChill(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.stakingChill
        )
      ),
    stakingNominate: (nominees) =>
      tx.stakingNominate(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.stakingNominate
        ),
        nominees
      ),
    stakingRebond: (bond) =>
      tx.stakingRebond(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.stakingRebond
        ),
        bond
      ),
    stakingSetPayee: (payee) =>
      tx.stakingSetPayee(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.stakingSetPayee
        ),
        payee
      ),
    stakingUnbond: (bond) =>
      tx.stakingUnbond(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.stakingUnbond
        ),
        bond
      ),
    stakingWithdraw: (numSlashingSpans) =>
      tx.stakingWithdraw(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.stakingWithdraw
        ),
        numSlashingSpans
      ),
    transferKeepAlive: (to, value) =>
      tx.transferKeepAlive(
        getApiForOperation(
          apiRelay,
          apiPeople,
          apiHub,
          chainConfig.txApis.transferKeepAlive
        ),
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
      new ExtraSignedExtension(getApi(specName), {
        signerAddress,
        payloadOptions,
      }),
    metadata: async (specName) =>
      await getApi(specName).call.metadata.metadataAtVersion(15),
  },
  spec: {
    ss58: (specName) => getApi(specName).consts.system.ss58Prefix,
  },
  codec: {
    $Signature: (specName) =>
      getApi(specName).registry.findCodec(
        getApi(specName).registry.metadata.extrinsic.signatureTypeId
      ),
  },
})
