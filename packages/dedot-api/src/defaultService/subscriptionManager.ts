// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { reconnectSync$ } from '@w3ux/observables-connect'
import { formatAccountSs58 } from '@w3ux/utils'
import type { DedotClient } from 'dedot'
import {
  activeAddress$,
  activePoolIds$,
  bonded$,
  getActiveAddress,
  getLocalActiveProxy,
  getSyncing,
  importedAccounts$,
  proxies$,
  removeSyncing,
  setActiveProxy,
} from 'global-bus'
import { combineLatest, pairwise, startWith, type Subscription } from 'rxjs'
import type { NetworkId, ServiceInterface, SystemChainId } from 'types'
import { AccountBalanceQuery } from '../subscribe/accountBalance'
import { ActivePoolQuery } from '../subscribe/activePool'
import { BondedQuery } from '../subscribe/bonded'
import { EraRewardPointsQuery } from '../subscribe/eraRewardPoints'
import { FastUnstakeQueueQuery } from '../subscribe/fastUnstakeQueue'
import { PoolMembershipQuery } from '../subscribe/poolMembership'
import { ProxiesQuery } from '../subscribe/proxies'
import { StakingLedgerQuery } from '../subscribe/stakingLedger'
import { StakingMetricsQuery } from '../subscribe/stakingMetrics'
import type {
  ActivePools,
  AssetHubChain,
  BondedAccounts,
  PeopleChain,
  PoolMemberships,
  Proxies,
  RelayChain,
  StakingChain,
  StakingLedgers,
} from '../types'
import {
  diffBonded,
  diffImportedAccounts,
  diffPoolIds,
  formatAccountAddresses,
  getAccountKey,
  keysOf,
} from '../util'
import type { AccountBalances } from './types'

/**
 * Manages all subscriptions for a service
 */
export class SubscriptionManager<
  RelayApi extends RelayChain,
  PeopleApi extends PeopleChain,
  HubApi extends AssetHubChain,
  StakingApi extends StakingChain,
> {
  subActiveAddress: Subscription
  subImportedAccounts: Subscription
  subActiveEra: Subscription
  subAccountBalances: AccountBalances<RelayApi, PeopleApi, HubApi> = {
    relay: {},
    people: {},
    hub: {},
  }
  subBonded: BondedAccounts<StakingApi> = {}
  subStakingLedgers: StakingLedgers<StakingApi> = {}
  subActivePoolIds: Subscription
  subActivePools: ActivePools<StakingApi> = {}
  subPoolMemberships: PoolMemberships<StakingApi> = {}
  subProxies: Proxies<StakingApi> = {}
  subActiveProxies: Subscription
  subActiveBonded: Subscription

  // Query objects that may need to be recreated
  stakingMetrics: StakingMetricsQuery<StakingApi>
  eraRewardPoints: EraRewardPointsQuery<StakingApi>
  fastUnstakeQueue: FastUnstakeQueueQuery<StakingApi>

  constructor(
    private apiRelay: DedotClient<RelayApi>,
    private apiPeople: DedotClient<PeopleApi>,
    private apiHub: DedotClient<HubApi>,
    private stakingApi: DedotClient<StakingApi>,
    private ids: [NetworkId, SystemChainId, SystemChainId],
    private stakingConsts: { poolsPalletId: Uint8Array },
    private serviceInterface: ServiceInterface
  ) {}

  /**
   * Initialize subscriptions that depend on dynamic data
   */
  initializeDynamicSubscriptions() {
    // Active address subscription - recreates fast unstake queue
    this.subActiveAddress = activeAddress$.subscribe((activeAddress) => {
      if (activeAddress) {
        this.fastUnstakeQueue?.unsubscribe()
        this.fastUnstakeQueue = new FastUnstakeQueueQuery(
          this.stakingApi,
          activeAddress
        )
      }
    })

    // Imported accounts subscription - manages account balances and related subscriptions
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
            this.subProxies?.[address]?.unsubscribe()
            this.subPoolMemberships?.[address]?.unsubscribe()
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
          this.stakingApi,
          account.address
        )
        this.subPoolMemberships[account.address] = new PoolMembershipQuery(
          this.stakingApi,
          account.address
        )
        this.subProxies[account.address] = new ProxiesQuery(
          this.stakingApi,
          account.address
        )
      })
    })

    // Active bonded subscription - manages staking ledgers
    this.subActiveBonded = bonded$
      .pipe(startWith([]), pairwise())
      .subscribe(([prev, cur]) => {
        const { added, removed } = diffBonded(prev, cur)
        removed.forEach(({ stash }) => {
          this.subStakingLedgers?.[stash]?.unsubscribe()
        })
        added.forEach(({ stash, bonded }) => {
          this.subStakingLedgers[stash] = new StakingLedgerQuery(
            this.stakingApi,
            stash,
            bonded
          )
        })
      })

    // Active proxies subscription - manages proxy state
    this.subActiveProxies = combineLatest([proxies$, reconnectSync$]).subscribe(
      ([proxies, sync]) => {
        const activeAddress = getActiveAddress()
        const proxiesSynced = Object.keys(proxies).find(
          (address) => address === activeAddress
        )
        const localProxy = getLocalActiveProxy(this.ids[0])
        if (sync === 'synced' && getSyncing('active-proxy')) {
          if (!activeAddress) {
            removeSyncing('active-proxy')
            return
          }
          if (proxiesSynced && activeAddress && localProxy) {
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

    // Active pool IDs subscription - manages active pools
    this.subActivePoolIds = activePoolIds$
      .pipe(startWith([]), pairwise())
      .subscribe(([prev, cur]) => {
        const { added, removed } = diffPoolIds(prev, cur)
        removed.forEach((poolId) => {
          this.subActivePools[poolId]?.unsubscribe()
        })
        added.forEach((poolId) => {
          this.subActivePools[poolId] = new ActivePoolQuery(
            this.stakingApi,
            poolId,
            this.stakingConsts.poolsPalletId,
            this.serviceInterface
          )
        })
      })
  }

  /**
   * Set the active era subscription with the provided observable
   */
  setActiveEraSubscription(activeEra$: {
    subscribe: (
      callback: (data: { index: number }) => Promise<void>
    ) => Subscription
  }) {
    this.subActiveEra = activeEra$.subscribe(
      async ({ index }: { index: number }) => {
        if (index > 0) {
          this.stakingMetrics?.unsubscribe()
          this.stakingMetrics = new StakingMetricsQuery(this.stakingApi, index)
          this.eraRewardPoints?.unsubscribe()
          this.eraRewardPoints = new EraRewardPointsQuery(
            this.stakingApi,
            index
          )
        }
      }
    )
  }

  /**
   * Unsubscribe from all subscriptions
   */
  async unsubscribe() {
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

    this.stakingMetrics?.unsubscribe()
    this.eraRewardPoints?.unsubscribe()
    this.fastUnstakeQueue?.unsubscribe()
  }
}
