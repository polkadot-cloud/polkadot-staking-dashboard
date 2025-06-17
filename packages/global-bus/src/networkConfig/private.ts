// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import type { NetworkConfig } from 'types'
import { defaultNetworkConfig } from './default'

export const _networkConfig = new BehaviorSubject<NetworkConfig>(
  defaultNetworkConfig
)
