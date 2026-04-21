// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { StakingChain } from '../types'

// One-shot query returning the delegate addresses for a given delegator. Used by consumers that
// need a point-in-time check (e.g. manual proxy declaration) without maintaining a live
// subscription.
export const queryProxies = async <T extends StakingChain>(
	api: DedotClient<T>,
	address: string,
): Promise<string[]> => {
	const [result] = await api.query.proxy.proxies(address)
	return result.map((r) => r.delegate.address(api.consts.system.ss58Prefix))
}
