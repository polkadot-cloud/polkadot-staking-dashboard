// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  resetActiveEra,
  resetApiStatus,
  resetBlockNumber,
  resetChainSpecs,
  resetConsts,
  resetPoolsConfig,
  resetRelayMetrics,
  resetServiceInterface,
  resetStakingMetrics,
} from 'global-bus'

export const onNetworkReset = () => {
  resetActiveEra()
  resetApiStatus()
  resetChainSpecs()
  resetConsts()
  resetRelayMetrics()
  resetPoolsConfig()
  resetStakingMetrics()
  resetBlockNumber()
  resetServiceInterface()
}
