// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { WestendAssetHubApi } from '@dedot/chaintypes'
import type { WestendApi } from '@dedot/chaintypes/westend'
import type { WestendPeopleApi } from '@dedot/chaintypes/westend-people'
import { formatAccountSs58 } from '@w3ux/utils'
import { ExtraSignedExtension, type DedotClient } from 'dedot'
import {
  activeAddress$,
  activePoolIds$,
  bonded$,
  defaultSyncStatus,
  importedAccounts$,
  initActiveProxy,
  removeSyncing,
  setConsts,
  setMultiChainSpecs,
  setSyncingMulti,
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
import { BondedQuery } from '../subscribe/bonded'
import { EraRewardPointsQuery } from '../subscribe/eraRewardPoints'
import { FastUnstakeConfigQuery } from '../subscribe/fastUnstakeConfig'
import { FastUnstakeQueueQuery } from '../subscribe/fastUnstakeQueue'
import { PoolMembershipQuery } from '../subscribe/poolMembership'
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
  BondedAccounts,
  DefaultServiceClass,
  PoolMemberships,
  Proxies,
  StakingLedgers,
} from '../types/serviceDefault'
import {
  diffBonded,
  diffImportedAccounts,
  diffPoolIds,
  formatAccountAddresses,
  getAccountKey,
  keysOf,
} from '../util'

export class WestendService
  implements
    DefaultServiceClass<
      WestendApi,
      WestendPeopleApi,
      WestendAssetHubApi,
      WestendAssetHubApi
    >
{
  relayChainSpec: ChainSpecs<WestendApi>
  peopleChainSpec: ChainSpecs<WestendPeopleApi>
  hubChainSpec: ChainSpecs<WestendAssetHubApi>

  apiStatus: {
    relay: ApiStatus<WestendApi>
    people: ApiStatus<WestendPeopleApi>
    hub: ApiStatus<WestendAssetHubApi>
  }
  coreConsts: CoreConsts<WestendApi>
  stakingConsts: StakingConsts<WestendAssetHubApi>
  blockNumber: BlockNumberQuery<WestendApi>
  activeEra: ActiveEraQuery<WestendAssetHubApi>
  relayMetrics: RelayMetricsQuery<WestendApi>
  poolsConfig: PoolsConfigQuery<WestendAssetHubApi>
  stakingMetrics: StakingMetricsQuery<WestendAssetHubApi>
  eraRewardPoints: EraRewardPointsQuery<WestendAssetHubApi>
  fastUnstakeConfig: FastUnstakeConfigQuery<WestendAssetHubApi>
  fastUnstakeQueue: FastUnstakeQueueQuery<WestendAssetHubApi>

  subActiveAddress: Subscription
  subActiveEra: Subscription
  subImportedAccounts: Subscription
  subAccountBalances: AccountBalances<
    WestendApi,
    WestendPeopleApi,
    WestendAssetHubApi
  > = {
    relay: {},
    people: {},
    hub: {},
  }
  subBonded: BondedAccounts<WestendAssetHubApi> = {}
  subStakingLedgers: StakingLedgers<WestendAssetHubApi> = {}
  subPoolMemberships: PoolMemberships<WestendAssetHubApi> = {}
  subProxies: Proxies<WestendAssetHubApi> = {}
  subActivePoolIds: Subscription
  subActivePools: ActivePools<WestendAssetHubApi> = {}
  subActiveBonded: Subscription

  constructor(
    public networkConfig: NetworkConfig,
    public ids: [NetworkId, SystemChainId, SystemChainId],
    public apiRelay: DedotClient<WestendApi>,
    public apiPeople: DedotClient<WestendPeopleApi>,
    public apiHub: DedotClient<WestendAssetHubApi>
  ) {
    this.apiStatus = {
      relay: new ApiStatus(this.apiRelay, ids[0], networkConfig),
      people: new ApiStatus(this.apiPeople, ids[1], networkConfig),
      hub: new ApiStatus(this.apiHub, ids[2], networkConfig),
    }
  }
  getApi = (id: string) => {
    if (id === this.ids[0]) {
      return this.apiRelay
    } else if (id === this.ids[1]) {
      return this.apiPeople
    } else {
      return this.apiHub
    }
  }

  start = async () => {
    this.relayChainSpec = new ChainSpecs(this.apiRelay)
    this.peopleChainSpec = new ChainSpecs(this.apiPeople)
    this.hubChainSpec = new ChainSpecs(this.apiHub)

    this.coreConsts = new CoreConsts(this.apiRelay)
    this.stakingConsts = new StakingConsts(this.apiHub)

    setSyncingMulti(defaultSyncStatus)
    initActiveProxy(this.ids[0])

    await Promise.all([
      this.relayChainSpec.fetch(),
      this.peopleChainSpec.fetch(),
      this.hubChainSpec.fetch(),
    ])
    setMultiChainSpecs({
      [this.ids[0]]: this.relayChainSpec.get(),
      [this.ids[1]]: this.peopleChainSpec.get(),
      [this.ids[2]]: this.hubChainSpec.get(),
    })
    setConsts(this.ids[0], {
      ...this.coreConsts.get(),
      ...this.stakingConsts.get(),
    })

    this.blockNumber = new BlockNumberQuery(this.apiRelay)
    this.activeEra = new ActiveEraQuery(this.apiHub)
    this.relayMetrics = new RelayMetricsQuery(this.apiRelay)
    this.poolsConfig = new PoolsConfigQuery(this.apiHub)
    this.fastUnstakeConfig = new FastUnstakeConfigQuery(this.apiHub)

    this.subActiveEra = this.activeEra.activeEra$.subscribe(
      async ({ index }) => {
        if (index > 0) {
          this.stakingMetrics?.unsubscribe()
          this.stakingMetrics = new StakingMetricsQuery(this.apiHub, index)
          this.eraRewardPoints?.unsubscribe()
          this.eraRewardPoints = new EraRewardPointsQuery(this.apiHub, index)
        }
      }
    )

    this.subActiveAddress = activeAddress$.subscribe((activeAddress) => {
      if (activeAddress) {
        this.fastUnstakeQueue?.unsubscribe()
        this.fastUnstakeQueue = new FastUnstakeQueueQuery(
          this.apiHub,
          activeAddress
        )
      }
    })

    this.subImportedAccounts = importedAccounts$.subscribe(([prev, cur]) => {
      const ss58 = this.apiRelay.consts.system.ss58Prefix
      const { added, removed } = diffImportedAccounts(
        prev.flat(),
        formatAccountAddresses(cur.flat(), ss58)
      )
      removed.forEach((account) => {
        const address = formatAccountSs58(
          account.address,
          this.apiRelay.consts.system.ss58Prefix
        )
        if (address) {
          this.ids.forEach((id, i) => {
            this.subAccountBalances[keysOf(this.subAccountBalances)[i]][
              getAccountKey(id, account)
            ]?.unsubscribe()
            this.subBonded[address]?.unsubscribe()
            this.subPoolMemberships?.[address]?.unsubscribe()
            this.subProxies?.[address]?.unsubscribe()
          })
        }
      })
      added.forEach((account) => {
        this.subAccountBalances['relay'][getAccountKey(this.ids[0], account)] =
          new AccountBalanceQuery(this.apiRelay, this.ids[0], account.address)
        this.subAccountBalances['people'][getAccountKey(this.ids[1], account)] =
          new AccountBalanceQuery(this.apiPeople, this.ids[1], account.address)
        this.subAccountBalances['hub'][getAccountKey(this.ids[2], account)] =
          new AccountBalanceQuery(this.apiHub, this.ids[2], account.address)

        this.subBonded[account.address] = new BondedQuery(
          this.apiHub,
          account.address
        )
        this.subPoolMemberships[account.address] = new PoolMembershipQuery(
          this.apiHub,
          account.address
        )
        this.subProxies[account.address] = new ProxiesQuery(
          this.apiHub,
          account.address
        )
      })
    })

    this.subActiveBonded = bonded$
      .pipe(startWith([]), pairwise())
      .subscribe(([prev, cur]) => {
        const { added, removed } = diffBonded(prev, cur)
        removed.forEach(({ stash }) => {
          this.subStakingLedgers?.[stash]?.unsubscribe()
        })
        added.forEach(({ stash, bonded }) => {
          this.subStakingLedgers[stash] = new StakingLedgerQuery(
            this.apiHub,
            stash,
            bonded
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
            this.apiHub,
            poolId,
            this.stakingConsts.poolsPalletId,
            this.interface
          )
        })
      })
    removeSyncing('initialization')
  }

  unsubscribe = async () => {
    for (const sub of Object.values(this.subActivePools)) {
      sub?.unsubscribe()
    }
    this.subActivePoolIds?.unsubscribe()
    this.subActiveBonded?.unsubscribe()
    for (const subs of Object.values(this.subAccountBalances)) {
      for (const sub of Object.values(subs)) {
        sub?.unsubscribe()
      }
    }
    for (const sub of Object.values(this.subStakingLedgers)) {
      sub?.unsubscribe()
    }
    for (const sub of Object.values(this.subBonded)) {
      sub?.unsubscribe()
    }
    for (const sub of Object.values(this.subPoolMemberships)) {
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

    await Promise.all([
      this.apiRelay.disconnect(),
      this.apiPeople.disconnect(),
      this.apiHub.disconnect(),
    ])
  }

  interface: ServiceInterface = {
    query: {
      erasValidatorRewardMulti: async (eras) =>
        await query.erasValidatorRewardMulti(this.apiHub, eras),
      bondedPool: async (poolId) => await query.bondedPool(this.apiHub, poolId),
      bondedPoolEntries: async () => await query.bondedPoolEntries(this.apiHub),
      erasStakersOverviewEntries: async (era) =>
        await query.erasStakersOverviewEntries(this.apiHub, era),
      erasStakersPagedEntries: async (era, validator) =>
        await query.erasStakersPagedEntries(this.apiHub, era, validator),
      identityOfMulti: async (addresses) =>
        await query.identityOfMulti(this.apiPeople, addresses),
      nominatorsMulti: async (addresses) =>
        await query.nominatorsMulti(this.apiHub, addresses),
      poolMembersMulti: async (addresses) =>
        await query.poolMembersMulti(this.apiHub, addresses),
      poolMetadataMulti: async (ids) =>
        await query.poolMetadataMulti(this.apiHub, ids),
      proxies: async (address) => await query.proxies(this.apiHub, address),
      sessionValidators: async () => await query.sessionValidators(this.apiHub),
      superOfMulti: async (addresses) =>
        await query.superOfMulti(
          this.apiPeople,
          addresses,
          this.apiPeople.consts.system.ss58Prefix
        ),
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
        createPool(this.apiHub, from, poolId, bond, metadata, nominees, roles),
      fastUnstakeDeregister: () => tx.fastUnstakeDeregister(this.apiHub),
      fastUnstakeRegister: () => tx.fastUnstakeRegister(this.apiHub),
      joinPool: (poolId, bond, claimPermission) =>
        tx.joinPool(this.apiHub, poolId, bond, claimPermission),
      newNominator: (bond, payee, nominees) =>
        tx.newNominator(this.apiHub, bond, payee, nominees),
      payoutStakersByPage: (validator, era, page) =>
        tx.payoutStakersByPage(this.apiHub, validator, era, page),
      poolBondExtra: (type, bond) => tx.poolBondExtra(this.apiHub, type, bond),
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
          minDelay
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
      stakingNominate: (nominees) => tx.stakingNominate(this.apiHub, nominees),
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
        payloadOptions = undefined
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
          this.getApi(specName).registry.metadata.extrinsic.signatureTypeId
        ),
    },
  }
}
