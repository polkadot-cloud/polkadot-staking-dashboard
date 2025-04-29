// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef, useState } from 'react'

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import { Syncs } from 'controllers/Syncs'
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
  defaultServiceInterface,
  defaultStakingMetrics,
  getRpcEndpoints,
  networkConfig$,
  poolsConfig$,
  relayMetrics$,
  serviceInterface$,
  stakingMetrics$,
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
  ServiceInterface,
  StakingMetrics,
} from 'types'
import type { APIContextInterface, APIProviderProps } from './types'

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
  const [stakingMetrics, setStakingMetrics] = useState<StakingMetrics>(
    defaultStakingMetrics
  )
  // Store the dedot api service interface
  const [serviceApi, setServiceApi] = useState<ServiceInterface>(
    defaultServiceInterface
  )

  const getApiStatus = (id: ChainId) => apiStatus[id] || 'disconnected'

  const getChainSpec = (chain: ChainId): ChainSpec =>
    chainSpecs[chain] || defaultChainSpecs

  const getConsts = (chain: ChainId): ChainConsts =>
    consts[chain] || defaultConsts

  // Get an RPC endpoint for a given chain
  const getRpcEndpoint = (chain: string): string => {
    const endpoints = getRpcEndpoints()
    return endpoints[chain]
  }

  const reInitialiseApi = async () => {
    // Dispatch all default syncIds as syncing
    Syncs.dispatchAllDefault()
  }

  // Handle initial api connection
  useEffect(() => {
    // Uses initialisation ref to check whether this is the first context render, and initializes an Api instance for the current network if that is the case
    if (!initialisedRef.current) {
      initialisedRef.current = true
      reInitialiseApi()
    }
  })

  // If RPC endpoint changes, and not on light client, re-initialise API
  useEffectIgnoreInitial(async () => {
    reInitialiseApi()
  }, [rpcEndpoints[network]])

  // Re-initialise API and set defaults on network change
  useEffectIgnoreInitial(() => {
    reInitialiseApi()
  }, [network])

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
    const subStakingMetrics = stakingMetrics$.subscribe((result) => {
      setStakingMetrics(result)
    })
    const subServiceInterface = serviceInterface$.subscribe((result) => {
      setServiceApi(result)
    })
    return () => {
      subNetwork.unsubscribe()
      subApiStatus.unsubscribe()
      subChainSpecs.unsubscribe()
      subConsts.unsubscribe()
      subActiveEra.unsubscribe()
      subRelayMetrics.unsubscribe()
      subPoolsConfig.unsubscribe()
      subStakingMetrics.unsubscribe()
      subServiceInterface.unsubscribe()
    }
  }, [])

  return (
    <APIContext.Provider
      value={{
        getApiStatus,
        getChainSpec,
        providerType,
        getRpcEndpoint,
        isReady: getApiStatus(network) === 'ready',
        getConsts,
        relayMetrics,
        activeEra,
        poolsConfig,
        stakingMetrics,
        serviceApi,
      }}
    >
      {children}
    </APIContext.Provider>
  )
}
