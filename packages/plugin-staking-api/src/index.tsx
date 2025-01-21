// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApolloProvider } from '@apollo/client'

export * from './Client'
export * from './queries/useCanFastUnstake'
export * from './queries/usePoolCandidates'
export * from './queries/usePoolEraPoints'
export * from './queries/usePoolRewards'
export * from './queries/useRewards'
export * from './queries/useTokenPrice'
export * from './queries/useUnclaimedRewards'
export * from './queries/useValidatorEraPoints'
export * from './util'

export { ApolloProvider }
