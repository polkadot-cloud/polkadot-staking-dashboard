// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const STAKING_API_ENDPOINT = 'https://api.staking.polkadot.cloud'

let client: ApolloClient | undefined

// Lazily instantiate the Apollo client so it is only created when the
// `staking_api` plugin is actually used (e.g. its provider is mounted or a
// query is fetched), rather than on module load.
export const getClient = (): ApolloClient => {
	if (!client) {
		client = new ApolloClient({
			cache: new InMemoryCache(),
			link: new HttpLink({
				uri: STAKING_API_ENDPOINT,
			}),
		})
	}
	return client
}
