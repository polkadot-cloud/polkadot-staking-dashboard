// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getNetworkData, getSystemChainData } from 'consts/util'
import { DedotClient, WsProvider } from 'dedot'
import type { NetworkConfig, NetworkId, SystemChainId } from 'types'
import { newRelayProvider, newSystemChainProvider } from './providers'
import { Services } from './services'
import type { DefaultService, Service } from './types'

// Determines service class and apis for a network
export const getDefaultService = async <T extends NetworkId>(
  network: T,
  { rpcEndpoints, providerType }: Omit<NetworkConfig, 'network'>
): Promise<DefaultService<T>> => {
  const relayData = getNetworkData(network)
  const peopleData = getSystemChainData(`people-${network}`)
  const peopleChainId: SystemChainId = `people-${network}`

  const relayProvider =
    providerType === 'ws'
      ? new WsProvider(relayData.endpoints.rpc[rpcEndpoints[network]])
      : await newRelayProvider(relayData)

  const peopleProvider =
    providerType === 'ws'
      ? new WsProvider(peopleData.endpoints.rpc[rpcEndpoints[peopleChainId]])
      : await newSystemChainProvider(relayData, peopleData)

  const [apiRelay, apiPeople] = [
    await DedotClient.new<Service[T][0]>(relayProvider),
    await DedotClient.new<Service[T][1]>(peopleProvider),
  ]
  return {
    Service: Services[network],
    apis: [apiRelay, apiPeople],
  }
}
