// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApolloProvider } from '@apollo/client'

export * from './Client'
export * from './queries/canFastUnstake'
export * from './queries/eraTotalNominators'
export * from './queries/getStakerWithNominees'
export * from './queries/isActiveStaker'
export * from './queries/nominatorRewardTrend'
export * from './queries/poolCandidates'
export * from './queries/poolEraPoints'
export * from './queries/poolRewards'
export * from './queries/poolRewardTrend'
export * from './queries/rewards'
export * from './queries/rpcEndpointHealth'
export * from './queries/searchValidators'
export * from './queries/tokenPrice'
export * from './queries/unclaimedRewards'
export * from './queries/validatorEraPoints'
export * from './queries/validatorEraPointsBatch'
export * from './queries/validatorRewards'
export * from './queries/validatorStats'
export * from './util'

export { ApolloProvider }
