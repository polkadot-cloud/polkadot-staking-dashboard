// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { WestendApi } from '@dedot/chaintypes/westend'
import type { WestendPeopleApi } from '@dedot/chaintypes/westend-people'
import { ExtraSignedExtension, type DedotClient } from 'dedot'
import {
  activeAddress$,
  activePoolIds$,
  importedAccounts$,
  setConsts,
  setMultiChainSpecs,
} from 'global-bus'
import { pairwise, startWith, type Subscription } from 'rxjs'
import type {
  NetworkConfig,
  NetworkId,
  ServiceInterface,
  SystemChainId,
} from 'types'
import { CoreConsts } from '../consts/core'
import { StakingConsts } from '../consts/staking'
import { query } from '../query'
import { runtimeApi } from '../runtimeApi'
import { ApiStatus } from '../spec/apiStatus'
import { ChainSpecs } from '../spec/chainSpecs'
import { AccountBalanceQuery } from '../subscribe/accountBalance'
import { ActiveEraQuery } from '../subscribe/activeEra'
import { ActivePoolQuery } from '../subscribe/activePool'
import { BlockNumberQuery } from '../subscribe/blockNumber'
import { EraRewardPointsQuery } from '../subscribe/eraRewardPoints'
import { FastUnstakeConfigQuery } from '../subscribe/fastUnstakeConfig'
import { FastUnstakeQueueQuery } from '../subscribe/fastUnstakeQueue'
import { PoolsConfigQuery } from '../subscribe/poolsConfig'
import { ProxiesQuery } from '../subscribe/proxies'
import { RelayMetricsQuery } from '../subscribe/relayMetrics'
import { StakingLedgerQuery } from '../subscribe/stakingLedger'
import { StakingMetricsQuery } from '../subscribe/stakingMetrics'
import { tx } from '../tx'
import { createPool } from '../tx/createPool'
import type {
  AccountBalances,
  ActivePools,
  DefaultServiceClass,
  Proxies,
  StakingLedgers,
} from '../types/serviceDefault'
import {
  diffImportedAccounts,
  diffPoolIds,
  getAccountKey,
  keysOf,
} from '../util'

export class WestendService
  implements DefaultServiceClass<WestendApi, WestendPeopleApi, WestendApi>
{
  relayChainSpec: ChainSpecs<WestendApi>
  peopleChainSpec: ChainSpecs<WestendPeopleApi>
  apiStatus: {
    relay: ApiStatus<WestendApi>
    people: ApiStatus<WestendPeopleApi>
  }
  coreConsts: CoreConsts<WestendApi>
  stakingConsts: StakingConsts<WestendApi>
  blockNumber: BlockNumberQuery<WestendApi>
  activeEra: ActiveEraQuery<WestendApi>
  relayMetrics: RelayMetricsQuery<WestendApi>
  poolsConfig: PoolsConfigQuery<WestendApi>
  stakingMetrics: StakingMetricsQuery<WestendApi>
  eraRewardPoints: EraRewardPointsQuery<WestendApi>
  fastUnstakeConfig: FastUnstakeConfigQuery<WestendApi>
  fastUnstakeQueue: FastUnstakeQueueQuery<WestendApi>

  subActiveAddress: Subscription
  subActiveEra: Subscription
  subImportedAccounts: Subscription
  subAccountBalances: AccountBalances<WestendApi, WestendPeopleApi> = {
    relay: {},
    people: {},
  }
  subStakingLedgers: StakingLedgers<WestendApi> = {}
  subProxies: Proxies<WestendApi> = {}
  subActivePoolIds: Subscription
  subActivePools: ActivePools<WestendApi> = {}

  constructor(
    public networkConfig: NetworkConfig,
    public ids: [NetworkId, SystemChainId],
    public apiRelay: DedotClient<WestendApi>,
    public apiPeople: DedotClient<WestendPeopleApi>
  ) {
    this.ids = ids
    this.apiRelay = apiRelay
    this.apiPeople = apiPeople
    this.networkConfig = networkConfig
    this.apiStatus = {
      relay: new ApiStatus(this.apiRelay, ids[0], networkConfig),
      people: new ApiStatus(this.apiPeople, ids[1], networkConfig),
    }
  }

  start = async () => {
    this.relayChainSpec = new ChainSpecs(this.apiRelay)
    this.peopleChainSpec = new ChainSpecs(this.apiPeople)
    this.coreConsts = new CoreConsts(this.apiRelay)
    this.stakingConsts = new StakingConsts(this.apiRelay)

    await Promise.all([
      this.relayChainSpec.fetch(),
      this.peopleChainSpec.fetch(),
    ])
    setMultiChainSpecs({
      [this.ids[0]]: this.relayChainSpec.get(),
      [this.ids[1]]: this.peopleChainSpec.get(),
    })
    setConsts(this.ids[0], {
      ...this.coreConsts.get(),
      ...this.stakingConsts.get(),
    })

    this.blockNumber = new BlockNumberQuery(this.apiRelay)
    this.activeEra = new ActiveEraQuery(this.apiRelay)
    this.relayMetrics = new RelayMetricsQuery(this.apiRelay)
    this.poolsConfig = new PoolsConfigQuery(this.apiRelay)
    this.fastUnstakeConfig = new FastUnstakeConfigQuery(this.apiRelay)

    this.subActiveEra = this.activeEra.activeEra$.subscribe(
      async ({ index }) => {
        if (index > 0) {
          this.stakingMetrics?.unsubscribe()
          this.stakingMetrics = new StakingMetricsQuery(this.apiRelay, index)
          this.eraRewardPoints?.unsubscribe()
          this.eraRewardPoints = new EraRewardPointsQuery(this.apiRelay, index)
        }
      }
    )

    this.subActiveAddress = activeAddress$.subscribe((activeAddress) => {
      if (activeAddress) {
        this.fastUnstakeQueue?.unsubscribe()
        this.fastUnstakeQueue = new FastUnstakeQueueQuery(
          this.apiRelay,
          activeAddress
        )
      }
    })

    this.subImportedAccounts = importedAccounts$.subscribe(([prev, cur]) => {
      const { added, removed } = diffImportedAccounts(prev.flat(), cur.flat())
      removed.forEach((account) => {
        this.ids.forEach((id, i) => {
          this.subAccountBalances[keysOf(this.subAccountBalances)[i]][
            getAccountKey(id, account)
          ]?.unsubscribe()
        })
        this.subStakingLedgers?.[account.address]?.unsubscribe()
        this.subProxies?.[account.address]?.unsubscribe()
      })
      added.forEach((account) => {
        this.subAccountBalances['relay'][getAccountKey(this.ids[0], account)] =
          new AccountBalanceQuery(this.apiRelay, this.ids[0], account.address)
        this.subAccountBalances['people'][getAccountKey(this.ids[1], account)] =
          new AccountBalanceQuery(this.apiPeople, this.ids[1], account.address)

        this.subStakingLedgers[account.address] = new StakingLedgerQuery(
          this.apiRelay,
          account.address
        )
        this.subProxies[account.address] = new ProxiesQuery(
          this.apiRelay,
          account.address
        )
      })
    })

    this.subActivePoolIds = activePoolIds$
      .pipe(startWith([]), pairwise())
      .subscribe(([prev, cur]) => {
        const { added, removed } = diffPoolIds(prev, cur)
        removed.forEach((poolId) => {
          this.subActivePools[poolId]?.unsubscribe()
        })
        added.forEach((poolId) => {
          this.subActivePools[poolId] = new ActivePoolQuery(
            this.apiRelay,
            poolId,
            this.stakingConsts.poolsPalletId,
            this.interface
          )
        })
      })
  }

  unsubscribe = async () => {
    for (const sub of Object.values(this.subActivePools)) {
      sub?.unsubscribe()
    }
    this.subActivePoolIds?.unsubscribe()
    for (const subs of Object.values(this.subAccountBalances)) {
      for (const sub of Object.values(subs)) {
        sub?.unsubscribe()
      }
    }
    for (const sub of Object.values(this.subStakingLedgers)) {
      sub?.unsubscribe()
    }
    for (const sub of Object.values(this.subProxies)) {
      sub?.unsubscribe()
    }
    this.subActiveEra?.unsubscribe()
    this.subActiveAddress?.unsubscribe()
    this.subImportedAccounts?.unsubscribe()

    this.blockNumber?.unsubscribe()
    this.relayMetrics?.unsubscribe()
    this.poolsConfig?.unsubscribe()
    this.fastUnstakeConfig?.unsubscribe()
    this.activeEra?.unsubscribe()
    this.stakingMetrics?.unsubscribe()
    this.eraRewardPoints?.unsubscribe()
    this.fastUnstakeQueue?.unsubscribe()

    await Promise.all([this.apiRelay.disconnect(), this.apiPeople.disconnect()])
  }

  interface: ServiceInterface = {
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
      paraSessionAccounts: async (session) =>
        await query.paraSessionAccounts(this.apiRelay, session),
      poolMembersMulti: async (addresses) =>
        await query.poolMembersMulti(this.apiRelay, addresses),
      poolMetadataMulti: async (ids) =>
        await query.poolMetadataMulti(this.apiRelay, ids),
      proxies: async (address) => await query.proxies(this.apiRelay, address),
      sessionValidators: async () =>
        await query.sessionValidators(this.apiRelay),
      superOfMulti: async (addresses) =>
        await query.superOfMulti(
          this.apiPeople,
          addresses,
          this.apiPeople.consts.system.ss58Prefix
        ),
      validatorEntries: async () => await query.validatorEntries(this.apiRelay),
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
          roles
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
          minDelay
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
      extraSignedExtension: (signerAddress, payloadOptions = undefined) =>
        new ExtraSignedExtension(this.apiRelay, {
          signerAddress,
          payloadOptions,
        }),
      metadata: async () =>
        await this.apiRelay.call.metadata.metadataAtVersion(15),
    },
    codec: {
      $Signature: () =>
        this.apiRelay.registry.findCodec(
          this.apiRelay.registry.metadata.extrinsic.signatureTypeId
        ),
    },
  }
}
