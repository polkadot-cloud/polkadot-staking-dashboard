// Discovered extensions along with their status

import type { NetworkId } from 'types'
import { _network } from './private'

export const network$ = _network.asObservable()

export const getNetwork = () => _network.getValue()

export const setNetwork = (network: NetworkId) => {
  _network.next(network)
}
