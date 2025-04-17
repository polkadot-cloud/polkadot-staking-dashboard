// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils'
import { useEffect, useRef, useState } from 'react'

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import { Era } from 'api/query/era'
import { NetworkMeta } from 'api/query/networkMeta'
import { ActiveEra } from 'api/subscribe/activeEra'
import { BlockNumber } from 'api/subscribe/blockNumber'
import { NetworkMetrics } from 'api/subscribe/networkMetrics'
import { PoolsConfig } from 'api/subscribe/poolsConfig'
import BigNumber from 'bignumber.js'
import { Apis } from 'controllers/Apis'
import { Subscriptions } from 'controllers/Subscriptions'
import { Syncs } from 'controllers/Syncs'
import { isCustomEvent } from 'controllers/utils'
import {
  apiStatus$,
  chainSpecs$,
  getRpcEndpoints,
  networkConfig$,
} from 'global-bus'
import { getInitialProviderType, getInitialRpcEndpoints } from 'global-bus/util'
import type { ApiStatus, ChainId, ChainSpec, ProviderType } from 'types'
import { useEventListener } from 'usehooks-ts'
import {
  defaultActiveEra,
  defaultChainSpecs,
  defaultConsts,
  defaultNetworkMetrics,
  defaultPoolsConfig,
  defaultStakingMetrics,
} from './defaults'
import type {
  APIActiveEra,
  APIConstants,
  APIContextInterface,
  APINetworkMetrics,
  APIPoolsConfig,
  APIProviderProps,
  APIStakingMetrics,
} from './types'

export const [APIContext, useApi] = createSafeContext<APIContextInterface>()

export const APIProvider = ({ children, network }: APIProviderProps) => {
  // Store Api connection status for active chain apis
  const [apiStatus, setApiStatus] = useState<Record<string, ApiStatus>>({})

  const getApiStatus = (id: ChainId) => apiStatus[id] || 'disconnected'

  // Store whether light client is active
  const [providerType, setProviderType] = useState<ProviderType>(
    getInitialProviderType()
  )

  // The current RPC endpoint for the network
  const [rpcEndpoints, setRpcEndpoints] = useState<Record<string, string>>(
    getInitialRpcEndpoints(network)
  )

  // Whether this context has initialised
  const initialisedRef = useRef<boolean>(false)

  // Store network constants
  const [consts, setConsts] = useState<APIConstants>(defaultConsts)

  // Store network metrics in state
  const [networkMetrics, setNetworkMetrics] = useState<APINetworkMetrics>(
    defaultNetworkMetrics
  )
  const networkMetricsRef = useRef(networkMetrics)

  // Store active era in state
  const [activeEra, setActiveEra] = useState<APIActiveEra>(defaultActiveEra)
  const activeEraRef = useRef(activeEra)

  // Store pool config in state
  const [poolsConfig, setPoolsConfig] =
    useState<APIPoolsConfig>(defaultPoolsConfig)
  const poolsConfigRef = useRef(poolsConfig)

  // Store staking metrics in state
  const [stakingMetrics, setStakingMetrics] = useState<APIStakingMetrics>(
    defaultStakingMetrics
  )
  const stakingMetricsRef = useRef(stakingMetrics)

  // Store chain specs
  const [chainSpecs, setChainSpecs] = useState<Record<string, ChainSpec>>({})

  // Temporary state object to check if chain spec from papi is received
  const [papiSpecReceived, setPapiSpecReceived] = useState<boolean>(false)

  // Whether the api is ready for querying
  const isReady = getApiStatus(network) === 'ready' && papiSpecReceived === true

  // Get a chain spec, or return an empty chain spec if not found
  const getChainSpec = (chain: ChainId): ChainSpec =>
    chainSpecs[chain] || defaultChainSpecs

  // Bootstrap app-wide chain state
  const bootstrapNetworkConfig = async () => {
    // 1. Fetch network data for bootstrapping app state:

    // Get active and previous era
    const { activeEra: newActiveEra, previousEra } = await new Era(
      network
    ).fetch()

    // Get network meta data related to staking and pools
    const {
      networkMetrics: newNetworkMetrics,
      poolsConfig: newPoolsConfig,
      stakingMetrics: newStakingMetrics,
    } = await new NetworkMeta(network).fetch(newActiveEra, previousEra)

    // 2. Populate all config state:

    setStateWithRef(newNetworkMetrics, setNetworkMetrics, networkMetricsRef)
    const { index, start } = newActiveEra
    setStateWithRef({ index, start }, setActiveEra, activeEraRef)
    setStateWithRef(newPoolsConfig, setPoolsConfig, poolsConfigRef)
    setStateWithRef(newStakingMetrics, setStakingMetrics, stakingMetricsRef)

    // Set `initialization` syncing to complete. NOTE: This synchonisation is only considering the
    // relay chain sync state, and not system/para chains
    Syncs.dispatch('initialization', 'complete')

    // 3. Initialise subscriptions:

    // Initialise block number subscription
    Subscriptions.set(network, 'blockNumber', new BlockNumber(network))

    // Initialise network metrics subscription
    Subscriptions.set(network, 'networkMetrics', new NetworkMetrics(network))

    // Initialise pool config subscription
    Subscriptions.set(network, 'poolsConfig', new PoolsConfig(network))

    // Initialise active era subscription. Also handles (re)subscribing to subscriptions that depend
    // on active era
    Subscriptions.set(network, 'activeEra', new ActiveEra(network))
  }

  const handlePapiReady = async (e: Event) => {
    if (isCustomEvent(e)) {
      const { chainType } = e.detail

      if (chainType === 'relay') {
        const api = Apis.get(network)
        const bondingDuration = await api.getConstant(
          'Staking',
          'BondingDuration',
          0
        )
        const sessionsPerEra = await api.getConstant(
          'Staking',
          'SessionsPerEra',
          0
        )
        const maxExposurePageSize = await api.getConstant(
          'Staking',
          'MaxExposurePageSize',
          0
        )
        const historyDepth = await api.getConstant('Staking', 'HistoryDepth', 0)
        const expectedBlockTime = await api.getConstant(
          'Babe',
          'ExpectedBlockTime',
          0
        )
        const epochDuration = await api.getConstant('Babe', 'EpochDuration', 0)
        const existentialDeposit = await api.getConstant(
          'Balances',
          'ExistentialDeposit',
          0
        )
        const fastUnstakeDeposit = await api.getConstant(
          'FastUnstake',
          'Deposit',
          0
        )
        const poolsPalletId = await api.getConstant(
          'NominationPools',
          'PalletId',
          new Uint8Array(0),
          'asBytes'
        )

        setPapiSpecReceived(true)

        setConsts({
          maxNominations: new BigNumber(16),
          bondDuration: new BigNumber(bondingDuration),
          sessionsPerEra: new BigNumber(sessionsPerEra),
          maxExposurePageSize: new BigNumber(maxExposurePageSize),
          historyDepth: new BigNumber(historyDepth),
          expectedBlockTime: new BigNumber(expectedBlockTime),
          epochDuration: new BigNumber(epochDuration),
          existentialDeposit: new BigNumber(existentialDeposit),
          fastUnstakeDeposit: new BigNumber(fastUnstakeDeposit),
          poolsPalletId,
        })

        bootstrapNetworkConfig()
      }
    }
  }

  // Handle api status events

  // Handle an Api status event for a system chain. NOTE: Only People chain is currently being used

  // Handle new network metrics updates
  const handleNetworkMetricsUpdate = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { networkMetrics: newNetworkMetrics } = e.detail
      // Only update if values have changed
      if (
        JSON.stringify(newNetworkMetrics) !==
        JSON.stringify(networkMetricsRef.current)
      ) {
        setStateWithRef(
          {
            ...networkMetricsRef.current,
            ...newNetworkMetrics,
          },
          setNetworkMetrics,
          networkMetricsRef
        )
      }
    }
  }

  // Handle new active era updates
  const handleActiveEraUpdate = (e: Event): void => {
    if (isCustomEvent(e)) {
      let { activeEra: newActiveEra } = e.detail
      const { index, start } = newActiveEra
      if (index === 0 || !start) {
        return
      }
      newActiveEra = {
        index: new BigNumber(index),
        start: new BigNumber(start),
      }

      // Only update if values have changed
      if (
        JSON.stringify(newActiveEra) !== JSON.stringify(activeEraRef.current)
      ) {
        setStateWithRef(
          {
            index: new BigNumber(index),
            start: new BigNumber(start),
          },
          setActiveEra,
          activeEraRef
        )
      }
    }
  }

  // Handle new pools config updates
  const handlePoolsConfigUpdate = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { poolsConfig: newPoolsConfig } = e.detail
      // Only update if values have changed
      if (
        JSON.stringify(newPoolsConfig) !==
        JSON.stringify(poolsConfigRef.current)
      ) {
        setStateWithRef(
          {
            ...poolsConfigRef.current,
            ...newPoolsConfig,
          },
          setPoolsConfig,
          poolsConfigRef
        )
      }
    }
  }

  // Handle new staking metrics updates
  const handleStakingMetricsUpdate = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { stakingMetrics: newStakingMetrics } = e.detail
      // Only update if values have changed
      if (
        JSON.stringify(newStakingMetrics) !==
        JSON.stringify(stakingMetricsRef.current)
      ) {
        setStateWithRef(
          {
            ...stakingMetricsRef.current,
            ...newStakingMetrics,
          },
          setStakingMetrics,
          stakingMetricsRef
        )
      }
    }
  }

  // Get an RPC endpoint for a given chain
  const getRpcEndpoint = (chain: string): string => {
    const endpoints = getRpcEndpoints()
    return endpoints[chain]
  }

  const reInitialiseApi = async (type: ProviderType) => {
    // Dispatch all default syncIds as syncing
    Syncs.dispatchAllDefault()

    // Instantiate new Relay chain API instance
    await Apis.instantiate(network, type, getRpcEndpoint(network))
  }

  // Handle initial api connection
  useEffect(() => {
    // Uses initialisation ref to check whether this is the first context render, and initializes an Api instance for the current network if that is the case
    if (!initialisedRef.current) {
      initialisedRef.current = true
      reInitialiseApi(providerType)
    }
  })

  // If RPC endpoint changes, and not on light client, re-initialise API
  useEffectIgnoreInitial(async () => {
    if (providerType !== 'sc') {
      reInitialiseApi('ws')
    }
  }, [rpcEndpoints[network]])

  // If connection type changes, re-initialise API
  useEffectIgnoreInitial(async () => {
    reInitialiseApi(providerType)
  }, [providerType])

  // Re-initialise API and set defaults on network change
  useEffectIgnoreInitial(() => {
    setConsts(defaultConsts)
    setStateWithRef(defaultNetworkMetrics, setNetworkMetrics, networkMetricsRef)
    setStateWithRef(defaultActiveEra, setActiveEra, activeEraRef)
    setStateWithRef(defaultPoolsConfig, setPoolsConfig, poolsConfigRef)
    setStateWithRef(defaultStakingMetrics, setStakingMetrics, stakingMetricsRef)

    reInitialiseApi(providerType)
  }, [network])

  // Call `unsubscribe` on active instance on unmount
  useEffect(
    () => () => {
      const instance = Apis.get(network)
      instance?.unsubscribe()
    },
    []
  )

  // Add event listener for api events and subscription updates
  const documentRef = useRef<Document>(document)
  useEventListener('api-ready', handlePapiReady, documentRef)
  useEventListener(
    'new-network-metrics',
    handleNetworkMetricsUpdate,
    documentRef
  )
  useEventListener('new-active-era', handleActiveEraUpdate, documentRef)
  useEventListener('new-pools-config', handlePoolsConfigUpdate, documentRef)
  useEventListener(
    'new-staking-metrics',
    handleStakingMetricsUpdate,
    documentRef
  )

  // Subscribe to global bus
  useEffect(() => {
    const subNetwork = networkConfig$.subscribe((result) => {
      setRpcEndpoints(result.rpcEndpoints)
      setProviderType(result.providerType)
    })
    const subApiStatus = apiStatus$.subscribe((result) => {
      setApiStatus(result)
    })
    const subChainSpecs = chainSpecs$.subscribe((result) => {
      setChainSpecs(result)
    })
    return () => {
      subNetwork.unsubscribe()
      subApiStatus.unsubscribe()
      subChainSpecs.unsubscribe()
    }
  }, [])

  return (
    <APIContext.Provider
      value={{
        getApiStatus,
        getChainSpec,
        providerType,
        getRpcEndpoint,
        isReady,
        consts,
        networkMetrics,
        activeEra,
        activeEraRef,
        poolsConfig,
        stakingMetrics,
      }}
    >
      {children}
    </APIContext.Provider>
  )
}
