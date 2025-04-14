// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getNetworkData, getSystemChainData } from 'consts/util'
import { DedotClient, WsProvider } from 'dedot'
import { getInitialRpcEndpoints } from 'global-bus/util'
import type { NetworkId, SystemChainId } from 'types'
import { Services } from './services'
import type { ServiceApis, ServiceType } from './types'

// Determines service class and apis for a network
export const getDefaultService = async <T extends NetworkId>(
  network: T
): Promise<{
  Service: ServiceType[T]
  apis: [DedotClient<ServiceApis[T][0]>, DedotClient<ServiceApis[T][1]>]
}> => {
  // TODO: Add light client support
  const keys = getInitialRpcEndpoints(network)
  const peopleChainId: SystemChainId = `people-${network}`

  const relayEndpoint = getNetworkData(network).endpoints.rpc[keys[network]]
  const peopleEndpoint =
    getSystemChainData(peopleChainId).endpoints.rpc[keys[peopleChainId]]

  const [apiRelay, apiPeople] = [
    await DedotClient.new<ServiceApis[T][0]>(new WsProvider(relayEndpoint)),
    await DedotClient.new<ServiceApis[T][1]>(new WsProvider(peopleEndpoint)),
  ]
  return {
    Service: Services[network],
    apis: [apiRelay, apiPeople],
  }
}
