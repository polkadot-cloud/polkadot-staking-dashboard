// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getHubChainId, getNetworkData, getSystemChainData } from 'consts/util'
import { DedotClient, WsProvider } from 'dedot'
import { setMultiApiStatus } from 'global-bus'
import type { NetworkConfig, NetworkId, SystemChainId } from 'types'
import { Services } from './services'
import {
  newRelayChainSmProvider,
  newSystemChainSmProvider,
} from './smoldot/providers'
import type { Service } from './types'
import type { DefaultService } from './types/serviceDefault'

// Determines service class and apis for a network
export const getDefaultService = async <T extends NetworkId>(
  network: T,
  { rpcEndpoints, providerType }: Omit<NetworkConfig, 'network'>
): Promise<DefaultService<T>> => {
  const peopleChainId: SystemChainId = `people-${network}`
  const hubChainId: SystemChainId = getHubChainId(network)

  const relayData = getNetworkData(network)
  const peopleData = getSystemChainData(`people-${network}`)
  const hubData = getSystemChainData(hubChainId)

  const ids = [network, peopleChainId, hubChainId] as [
    NetworkId,
    SystemChainId,
    SystemChainId,
  ]

  const relayProvider =
    providerType === 'ws'
      ? new WsProvider(relayData.endpoints.rpc[rpcEndpoints[network]])
      : await newRelayChainSmProvider(relayData)

  const peopleProvider =
    providerType === 'ws'
      ? new WsProvider(peopleData.endpoints.rpc[rpcEndpoints[peopleChainId]])
      : await newSystemChainSmProvider(relayData, peopleData)

  const hubProvider =
    providerType === 'ws'
      ? new WsProvider(hubData.endpoints.rpc[rpcEndpoints[hubChainId]])
      : await newSystemChainSmProvider(relayData, hubData)

  setMultiApiStatus({
    [network]: 'connecting',
    [peopleChainId]: 'connecting',
    [hubChainId]: 'connecting',
  })

  const [apiRelay, apiPeople, apiHub] = await Promise.all([
    DedotClient.new<Service[T][0]>(relayProvider),
    DedotClient.new<Service[T][1]>(peopleProvider),
    DedotClient.new<Service[T][2]>(hubProvider),
  ])

  setMultiApiStatus({
    [network]: 'ready',
    [peopleChainId]: 'ready',
    [hubChainId]: 'ready',
  })

  return {
    Service: Services[network],
    apis: [apiRelay, apiPeople, apiHub],
    ids,
  }
}
