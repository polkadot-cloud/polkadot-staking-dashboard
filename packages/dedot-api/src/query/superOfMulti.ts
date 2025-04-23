// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { PeopleChain } from '../types'

export const superOfMulti = async <T extends PeopleChain>(
  api: DedotClient<T>,
  addresses: string[]
) => await api.query.identity.superOf.multi(addresses)
