// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DocumentNode } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { client } from '../Client'
import type { QueryReturn } from '../types'

type Variables = Record<string, unknown>

/**
 * Generic GraphQL query fetcher. Swallows errors and returns `defaultData` when the request fails
 * or returns no data.
 */
export const fetchQuery = async <T>(
	query: DocumentNode,
	variables: Variables,
	defaultData: T,
): Promise<T> => {
	try {
		const result = await client.query<T>({ query, variables })
		return result?.data || defaultData
	} catch {
		return defaultData
	}
}

/**
 * Generic React hook wrapper around Apollo's `useQuery`. Returns `defaultData` while loading or
 * when data is unavailable.
 */
export const useApiQuery = <T>(
	query: DocumentNode,
	variables: Variables,
	defaultData: T,
	options?: { skip?: boolean },
): QueryReturn<T> => {
	const { loading, error, data, refetch } = useQuery<T>(query, {
		variables,
		...options,
	})
	return { loading, error, data: data || defaultData, refetch }
}
