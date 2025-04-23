// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  resetActiveEra,
  resetApiStatus,
  resetBlockNumber,
  resetChainSpecs,
  resetConsts,
  resetEraRewardPoints,
  resetPoolsConfig,
  resetRelayMetrics,
  resetServiceInterface,
  resetStakingMetrics,
} from 'global-bus'

export const onNetworkReset = () => {
  resetBlockNumber()
  resetActiveEra()
  resetApiStatus()
  resetChainSpecs()
  resetConsts()
  resetRelayMetrics()
  resetPoolsConfig()
  resetStakingMetrics()
  resetEraRewardPoints()
  resetServiceInterface()
}
