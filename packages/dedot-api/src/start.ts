// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getNetworkData, getSystemChainData } from 'consts/util'
import { DedotClient, WsProvider } from 'dedot'
import type { NetworkId, ProviderType, SystemChainId } from 'types'
import { newRelayProvider, newSystemChainProvider } from './providers'
import { Services } from './services'
import type { ServiceApis, ServiceType } from './types'

// Determines service class and apis for a network
export const getDefaultService = async <T extends NetworkId>(
  network: T,
  {
    rpcEndpoints,
    providerType,
  }: { rpcEndpoints: Record<string, string>; providerType: ProviderType }
): Promise<{
  Service: ServiceType[T]
  apis: [DedotClient<ServiceApis[T][0]>, DedotClient<ServiceApis[T][1]>]
}> => {
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
    await DedotClient.new<ServiceApis[T][0]>(relayProvider),
    await DedotClient.new<ServiceApis[T][1]>(peopleProvider),
  ]
  return {
    Service: Services[network],
    apis: [apiRelay, apiPeople],
  }
}
