// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import type { NetworkId } from 'types'

// TODO: Get initial network
export const _network = new BehaviorSubject<NetworkId>('polkadot')
