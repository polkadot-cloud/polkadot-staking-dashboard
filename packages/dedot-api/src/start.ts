// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getNetworkData, getSystemChainData } from 'consts/util'
import { DedotClient, WsProvider } from 'dedot'
import type { NetworkConfig, NetworkId, SystemChainId } from 'types'
import { newRelayProvider, newSystemChainProvider } from './providers'
import { Services } from './services'
import type { DefaultService, Service } from './types'
import { disaptch, formatApiStatusEvent } from './util'

// Determines service class and apis for a network
export const getDefaultService = async <T extends NetworkId>(
  network: T,
  { rpcEndpoints, providerType }: Omit<NetworkConfig, 'network'>
): Promise<DefaultService<T>> => {
  const relayData = getNetworkData(network)
  const peopleData = getSystemChainData(`people-${network}`)
  const peopleChainId: SystemChainId = `people-${network}`

  const ids = [network, peopleChainId] as [NetworkId, SystemChainId]

  const relayProvider =
    providerType === 'ws'
      ? new WsProvider(relayData.endpoints.rpc[rpcEndpoints[network]])
      : await newRelayProvider(relayData)

  const peopleProvider =
    providerType === 'ws'
      ? new WsProvider(peopleData.endpoints.rpc[rpcEndpoints[peopleChainId]])
      : await newSystemChainProvider(relayData, peopleData)

  for (const chain of ids) {
    disaptch('apiStatus', formatApiStatusEvent(network, chain, 'connecting'))
  }
  const [apiRelay, apiPeople] = await Promise.all([
    DedotClient.new<Service[T][0]>(relayProvider),
    DedotClient.new<Service[T][1]>(peopleProvider),
  ])
  for (const chain of ids) {
    disaptch('apiStatus', formatApiStatusEvent(network, chain, 'ready'))
  }

  return {
    Service: Services[network],
    apis: [apiRelay, apiPeople],
    ids,
  }
}
