// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils'
import { useEffect, useRef, useState } from 'react'

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import { ActiveEra } from 'api/subscribe/activeEra'
import { BlockNumber } from 'api/subscribe/blockNumber'
import { Apis } from 'controllers/Apis'
import { Subscriptions } from 'controllers/Subscriptions'
import { Syncs } from 'controllers/Syncs'
import { isCustomEvent } from 'controllers/utils'
import {
  activeEra$,
  apiStatus$,
  chainSpecs$,
  consts$,
  defaultActiveEra,
  defaultChainSpecs,
  defaultConsts,
  defaultPoolsConfig,
  defaultRelayMetrics,
  getRpcEndpoints,
  networkConfig$,
  poolsConfig$,
  relayMetrics$,
} from 'global-bus'
import { getInitialProviderType, getInitialRpcEndpoints } from 'global-bus/util'
import type {
  ApiStatus,
  ChainConsts,
  ChainId,
  ChainSpec,
  ActiveEra as IActiveEra,
  PoolsConfig,
  ProviderType,
  RelayMetrics,
  RpcEndpoints,
} from 'types'
import { useEventListener } from 'usehooks-ts'
import { defaultStakingMetrics } from './defaults'
import type {
  APIContextInterface,
  APIProviderProps,
  APIStakingMetrics,
} from './types'

export const [APIContext, useApi] = createSafeContext<APIContextInterface>()

export const APIProvider = ({ children, network }: APIProviderProps) => {
  // Store the active provider type
  const [providerType, setProviderType] = useState<ProviderType>(
    getInitialProviderType()
  )
  // RPC endpoints for active chains
  const [rpcEndpoints, setRpcEndpoints] = useState<RpcEndpoints>(
    getInitialRpcEndpoints(network)
  )
  // Store Api connection status for active chains
  const [apiStatus, setApiStatus] = useState<Record<string, ApiStatus>>({})

  // Chain specs for active chains
  const [chainSpecs, setChainSpecs] = useState<Record<string, ChainSpec>>({})

  // Chain consts
  const [consts, setConsts] = useState<Record<string, ChainConsts>>({})

  // Whether this context has initialised
  const initialisedRef = useRef<boolean>(false)

  // Store active era in state
  const [activeEra, setActiveEra] = useState<IActiveEra>(defaultActiveEra)

  // Store network metrics in state
  const [relayMetrics, setRelayMetrics] =
    useState<RelayMetrics>(defaultRelayMetrics)

  // Store pool config in state
  const [poolsConfig, setPoolsConfig] =
    useState<PoolsConfig>(defaultPoolsConfig)

  // Store staking metrics in state
  const [stakingMetrics, setStakingMetrics] = useState<APIStakingMetrics>(
    defaultStakingMetrics
  )
  const stakingMetricsRef = useRef(stakingMetrics)

  // Temporary state object to check if chain spec from papi is received
  const [papiSpecReceived, setPapiSpecReceived] = useState<boolean>(false)

  const getApiStatus = (id: ChainId) => apiStatus[id] || 'disconnected'

  const getChainSpec = (chain: ChainId): ChainSpec =>
    chainSpecs[chain] || defaultChainSpecs

  const getConsts = (chain: ChainId): ChainConsts =>
    consts[chain] || defaultConsts

  // Whether the api is ready for querying
  const isReady = getApiStatus(network) === 'ready' && papiSpecReceived === true

  // Bootstrap app-wide chain state
  const bootstrapNetworkConfig = async () => {
    // Set `initialization` syncing to complete. NOTE: This synchonisation is only considering the
    // relay chain sync state, and not system/para chains
    Syncs.dispatch('initialization', 'complete')

    // 3. Initialise subscriptions:

    // Initialise block number subscription
    Subscriptions.set(network, 'blockNumber', new BlockNumber(network))

    // Initialise active era subscription. Also handles (re)subscribing to subscriptions that depend
    // on active era
    Subscriptions.set(network, 'activeEra', new ActiveEra(network))
  }

  const handlePapiReady = async (e: Event) => {
    if (isCustomEvent(e)) {
      if (e.detail.chainType === 'relay') {
        setPapiSpecReceived(true)
        bootstrapNetworkConfig()
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
    reInitialiseApi('ws')
  }, [rpcEndpoints[network]])

  // If connection type changes, re-initialise API
  useEffectIgnoreInitial(async () => {
    reInitialiseApi(providerType)
  }, [providerType])

  // Re-initialise API and set defaults on network change
  useEffectIgnoreInitial(() => {
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
    const subConsts = consts$.subscribe((result) => {
      setConsts(result)
    })
    const subActiveEra = activeEra$.subscribe((result) => {
      setActiveEra(result)
    })
    const subRelayMetrics = relayMetrics$.subscribe((result) => {
      setRelayMetrics(result)
    })
    const subPoolsConfig = poolsConfig$.subscribe((result) => {
      setPoolsConfig(result)
    })
    return () => {
      subNetwork.unsubscribe()
      subApiStatus.unsubscribe()
      subChainSpecs.unsubscribe()
      subConsts.unsubscribe()
      subActiveEra.unsubscribe()
      subRelayMetrics.unsubscribe()
      subPoolsConfig.unsubscribe()
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
        getConsts,
        relayMetrics,
        activeEra,
        poolsConfig,
        stakingMetrics,
      }}
    >
      {children}
    </APIContext.Provider>
  )
}
