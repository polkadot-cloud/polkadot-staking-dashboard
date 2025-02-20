// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApolloProvider } from '@apollo/client'

export * from './Client'
export * from './queries/activeValidatorRanks'
export * from './queries/canFastUnstake'
export * from './queries/nominatorRewardTrend'
export * from './queries/poolCandidates'
export * from './queries/poolEraPoints'
export * from './queries/poolRewards'
export * from './queries/poolRewardTrend'
export * from './queries/rewards'
export * from './queries/tokenPrice'
export * from './queries/unclaimedRewards'
export * from './queries/validatorEraPoints'
export * from './queries/validatorEraPointsBatch'
export * from './queries/validatorRewards'
export * from './util'

export { ApolloProvider }
