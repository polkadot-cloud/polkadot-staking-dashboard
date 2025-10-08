// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { FastUnstakeChain } from '../types'
import { asTx } from '../util'

export const fastUnstakeDeregister = <T extends FastUnstakeChain>(
	api: DedotClient<T>,
) => asTx(api.tx.fastUnstake.deregister())
