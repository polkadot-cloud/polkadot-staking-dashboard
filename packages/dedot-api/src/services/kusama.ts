// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { KusamaApi } from '@dedot/chaintypes/kusama'
import type { KusamaPeopleApi } from '@dedot/chaintypes/kusama-people'
import type { DedotClient } from 'dedot'
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
import { bondedPool } from '../query/bondedPool'
import { bondedPoolEntries } from '../query/bondedPoolEntries'
import { erasStakersOverviewEntries } from '../query/erasStakersOverviewEntries'
import { erasStakersPagedEntries } from '../query/erasStakersPagedEntries'
import { erasValidatorRewardMulti } from '../query/erasValidatorRewardMulti'
import { identityOfMulti } from '../query/identityOfMulti'
import { nominatorsMulti } from '../query/nominatorsMulti'
import { paraSessionAccounts } from '../query/paraSessionAccounts'
import { poolMembersMulti } from '../query/poolMembersMulti'
import { poolMetadataMulti } from '../query/poolMetadataMulti'
import { proxies } from '../query/proxies'
import { sessionValidators } from '../query/sessionValidators'
import { superOfMulti } from '../query/superOfMulti'
import { validatorEntries } from '../query/validatorEntries'
import { validatorsMulti } from '../query/validatorsMulti'
import { balanceToPoints } from '../runtimeApi/balanceToPoints'
import { pendingRewards } from '../runtimeApi/pendingRewards'
import { pointsToBalance } from '../runtimeApi/pointsToBalance'
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

export class KusamaService
  implements DefaultServiceClass<KusamaApi, KusamaPeopleApi, KusamaApi>
{
  relayChainSpec: ChainSpecs<KusamaApi>
  peopleChainSpec: ChainSpecs<KusamaPeopleApi>
  apiStatus: {
    relay: ApiStatus<KusamaApi>
    people: ApiStatus<KusamaPeopleApi>
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
  subAccountBalances: AccountBalances<KusamaApi, KusamaPeopleApi> = {
    relay: {},
    people: {},
  }
  subStakingLedgers: StakingLedgers<KusamaApi> = {}
  subProxies: Proxies<KusamaApi> = {}
  subActivePoolIds: Subscription
  subActivePools: ActivePools<KusamaApi> = {}

  constructor(
    public networkConfig: NetworkConfig,
    public ids: [NetworkId, SystemChainId],
    public apiRelay: DedotClient<KusamaApi>,
    public apiPeople: DedotClient<KusamaPeopleApi>
  ) {
    this.ids = ids
    this.apiRelay = apiRelay
    this.apiPeople = apiPeople
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
      this.fastUnstakeQueue?.unsubscribe()
      if (activeAddress) {
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
          this.subStakingLedgers?.[account.address]?.unsubscribe()
          this.subProxies?.[account.address]?.unsubscribe()
        })
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
        await erasValidatorRewardMulti(this.apiRelay, eras),
      bondedPool: async (poolId) => await bondedPool(this.apiRelay, poolId),
      bondedPoolEntries: async () => await bondedPoolEntries(this.apiRelay),
      erasStakersOverviewEntries: async (era) =>
        await erasStakersOverviewEntries(this.apiRelay, era),
      erasStakersPagedEntries: async (era, validator) =>
        await erasStakersPagedEntries(this.apiRelay, era, validator),
      identityOfMulti: async (addresses) =>
        await identityOfMulti(this.apiPeople, addresses),
      nominatorsMulti: async (addresses) =>
        await nominatorsMulti(this.apiRelay, addresses),
      paraSessionAccounts: async (session) =>
        await paraSessionAccounts(this.apiRelay, session),
      poolMembersMulti: async (addresses) =>
        await poolMembersMulti(this.apiRelay, addresses),
      poolMetadataMulti: async (ids) =>
        await poolMetadataMulti(this.apiRelay, ids),
      proxies: async (address) => await proxies(this.apiRelay, address),
      sessionValidators: async () => await sessionValidators(this.apiRelay),
      superOfMulti: async (addresses) =>
        await superOfMulti(
          this.apiPeople,
          addresses,
          this.apiPeople.consts.system.ss58Prefix
        ),
      validatorEntries: async () => await validatorEntries(this.apiRelay),
      validatorsMulti: async (addresses) =>
        await validatorsMulti(this.apiRelay, addresses),
    },
    runtimeApi: {
      balanceToPoints: async (poolId, amount) =>
        await balanceToPoints(this.apiRelay, poolId, amount),
      pendingRewards: async (address) =>
        await pendingRewards(this.apiRelay, address),
      pointsToBalance: async (poolId, points) =>
        await pointsToBalance(this.apiRelay, poolId, points),
    },
  }
}
