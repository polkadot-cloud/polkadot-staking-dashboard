// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApolloClient, InMemoryCache } from '@apollo/client'

const STAKING_API_ENDPOINT = 'https://api.staking.polkadot.cloud'

const client = new ApolloClient({
  uri: STAKING_API_ENDPOINT,
  cache: new InMemoryCache(),
})

export { client }
