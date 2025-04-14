// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkList, SystemChainList } from 'consts/networks'
import { DedotClient, WsProvider } from 'dedot'
import { getRpcEndpoints } from 'global-bus'
import type { NetworkId } from 'types'
import type { DefaultServiceCallback, ServiceApiMap } from './types'

// Starts dedot api service for a network with the corresponding chain types
export const startDefaultService = async <T extends NetworkId>(
  network: T,
  callback: DefaultServiceCallback<ServiceApiMap[T][0], ServiceApiMap[T][1]>
) => {
  // TODO: Add light client support

  const endpointKeys = getRpcEndpoints()

  const apiRelay = await DedotClient.new<ServiceApiMap[T][0]>(
    new WsProvider(
      NetworkList[network].endpoints.rpcEndpoints[endpointKeys[network]]
    )
  )
  const apiPeople = await DedotClient.new<ServiceApiMap[T][1]>(
    new WsProvider(
      SystemChainList[`people-${network}`].endpoints.rpcEndpoints[
        endpointKeys[`people-${network}`]
      ]
    )
  )
  await callback(apiRelay, apiPeople)
}
