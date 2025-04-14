// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import { getNetwork } from '../network'
import { getInitialRpcEndpoints } from './util'

export const _rpcEndpoints = new BehaviorSubject<Record<string, string>>(
  getInitialRpcEndpoints(getNetwork())
)
