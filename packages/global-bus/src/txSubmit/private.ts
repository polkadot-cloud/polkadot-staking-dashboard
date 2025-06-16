// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import type { TxSubmissionItem } from 'types'

export const _uids = new BehaviorSubject<TxSubmissionItem[]>([])
