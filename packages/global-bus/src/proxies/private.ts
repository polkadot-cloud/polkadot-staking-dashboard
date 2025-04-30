// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import type { Proxies } from 'types'

type State = Record<string, Proxies>
export const _proxies = new BehaviorSubject<State>({})
