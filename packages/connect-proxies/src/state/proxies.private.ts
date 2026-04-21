// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import type { ProxyRecord } from '../types'

type State = Record<string, ProxyRecord>

export const _proxies = new BehaviorSubject<State>({})
