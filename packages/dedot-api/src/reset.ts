// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  resetAccountBalances,
  resetActiveEra,
  resetActivePoolIds,
  resetApiStatus,
  resetBlockNumber,
  resetChainSpecs,
  resetConsts,
  resetEraRewardPoints,
  resetFastUnstakeConfig,
  resetFastUnstakeQueue,
  resetPoolsConfig,
  resetRelayMetrics,
  resetServiceInterface,
  resetStakingLedgers,
  resetStakingMetrics,
} from 'global-bus'

export const onNetworkReset = () => {
  resetActivePoolIds()

  resetAccountBalances()
  resetStakingLedgers()

  resetBlockNumber()
  resetActiveEra()
  resetFastUnstakeConfig()
  resetFastUnstakeQueue()
  resetEraRewardPoints()

  resetApiStatus()
  resetRelayMetrics()
  resetStakingMetrics()
  resetPoolsConfig()
  resetServiceInterface()

  resetChainSpecs()
  resetConsts()
}
