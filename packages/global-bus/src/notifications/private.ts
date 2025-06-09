// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import type { NotificationItem } from 'types'

export const _notifications = new BehaviorSubject<NotificationItem[]>([])
