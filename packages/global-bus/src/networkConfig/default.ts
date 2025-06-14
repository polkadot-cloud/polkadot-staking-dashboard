import { DefaultNetwork } from 'consts/networks'
import { getInitialProviderType } from './util'

export const defaultNetworkConfig = {
  network: DefaultNetwork,
  rpcEndpoints: {},
  providerType: getInitialProviderType(),
}
