// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { HttpLink } from '@apollo/client/link/http'

const STAKING_API_ENDPOINT = 'https://api.staking.polkadot.cloud'

const client = new ApolloClient({
	link: new HttpLink({
		uri: STAKING_API_ENDPOINT,
	}),
	cache: new InMemoryCache(),
})

export { client }
