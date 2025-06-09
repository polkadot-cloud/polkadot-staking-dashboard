// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import type { PoolMembershipState } from 'types'

type State = Record<string, PoolMembershipState>
export const _poolMemberships = new BehaviorSubject<State>({})
