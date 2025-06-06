// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { KusamaAssetHubApi } from '@dedot/chaintypes'
import type { KusamaApi } from '@dedot/chaintypes/kusama'
import type { KusamaPeopleApi } from '@dedot/chaintypes/kusama-people'
import { reconnectSync$ } from '@w3ux/observables-connect'
import { formatAccountSs58 } from '@w3ux/utils'
import { ExtraSignedExtension, type DedotClient } from 'dedot'
import {
  activeAddress$,
  activePoolIds$,
  bonded$,
  defaultSyncStatus,
  getActiveAddress,
  getLocalActiveProxy,
  getSyncing,
  importedAccounts$,
  proxies$,
  removeSyncing,
  setActiveProxy,
  setConsts,
  setMultiChainSpecs,
  setSyncingMulti,
} from 'global-bus'
import { combineLatest, pairwise, startWith, type Subscription } from 'rxjs'
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

export class KusamaService
  implements
    DefaultServiceClass<
      KusamaApi,
      KusamaPeopleApi,
      KusamaAssetHubApi,
      KusamaApi
    >
{
  relayChainSpec: ChainSpecs<KusamaApi>
  peopleChainSpec: ChainSpecs<KusamaPeopleApi>
  hubChainSpec: ChainSpecs<KusamaAssetHubApi>

  apiStatus: {
    relay: ApiStatus<KusamaApi>
    people: ApiStatus<KusamaPeopleApi>
    hub: ApiStatus<KusamaAssetHubApi>
  }
  coreConsts: CoreConsts<KusamaApi>
  stakingConsts: StakingConsts<KusamaApi>
  blockNumber: BlockNumberQuery<KusamaApi>
  activeEra: ActiveEraQuery<KusamaApi>
  relayMetrics: RelayMetricsQuery<KusamaApi>
  poolsConfig: PoolsConfigQuery<KusamaApi>
  stakingMetrics: StakingMetricsQuery<KusamaApi>
  eraRewardPoints: EraRewardPointsQuery<KusamaApi>
  fastUnstakeConfig: FastUnstakeConfigQuery<KusamaApi>
  fastUnstakeQueue: FastUnstakeQueueQuery<KusamaApi>

  subActiveAddress: Subscription
  subActiveEra: Subscription
  subImportedAccounts: Subscription
  subAccountBalances: AccountBalances<
    KusamaApi,
    KusamaPeopleApi,
    KusamaAssetHubApi
  > = {
    relay: {},
    people: {},
    hub: {},
  }
  subBonded: BondedAccounts<KusamaApi> = {}
  subStakingLedgers: StakingLedgers<KusamaApi> = {}
  subPoolMemberships: PoolMemberships<KusamaApi> = {}
  subProxies: Proxies<KusamaApi> = {}
  subActiveProxies: Subscription
  subActivePoolIds: Subscription
  subActivePools: ActivePools<KusamaApi> = {}
  subActiveBonded: Subscription

  constructor(
    public networkConfig: NetworkConfig,
    public ids: [NetworkId, SystemChainId, SystemChainId],
    public apiRelay: DedotClient<KusamaApi>,
    public apiPeople: DedotClient<KusamaPeopleApi>,
    public apiHub: DedotClient<KusamaAssetHubApi>
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
    this.stakingConsts = new StakingConsts(this.apiRelay)

    setSyncingMulti(defaultSyncStatus)

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
            this.subPoolMemberships[address]?.unsubscribe()
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
          this.apiRelay,
          account.address
        )
        this.subPoolMemberships[account.address] = new PoolMembershipQuery(
          this.apiRelay,
          account.address
        )
        this.subProxies[account.address] = new ProxiesQuery(
          this.apiRelay,
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
            this.apiRelay,
            stash,
            bonded
          )
        })
      })

    this.subActiveProxies = combineLatest([proxies$, reconnectSync$]).subscribe(
      ([proxies, sync]) => {
        const activeAddress = getActiveAddress()
        const proxiesSynced = Object.keys(proxies).find(
          (address) => address === activeAddress
        )
        const localProxy = getLocalActiveProxy(this.ids[0])
        if (sync === 'synced' && proxiesSynced && getSyncing('active-proxy')) {
          if (activeAddress && localProxy) {
            for (const { proxyType, delegate } of proxies[activeAddress]
              .proxies) {
              if (
                proxyType === localProxy.proxyType &&
                delegate === localProxy.address
              ) {
                setActiveProxy(this.ids[0], localProxy)
                break
              }
            }
          }
          removeSyncing('active-proxy')
        }
      }
    )

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
    removeSyncing('initialization')
  }

  unsubscribe = async () => {
    for (const sub of Object.values(this.subActivePools)) {
      sub?.unsubscribe()
    }
    this.subActiveProxies?.unsubscribe()
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
