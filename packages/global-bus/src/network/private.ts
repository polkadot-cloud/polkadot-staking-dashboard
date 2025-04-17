// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import type { NetworkId } from 'types'
import { getInitialNetwork } from '../util'

export const _network = new BehaviorSubject<NetworkId>(getInitialNetwork())
