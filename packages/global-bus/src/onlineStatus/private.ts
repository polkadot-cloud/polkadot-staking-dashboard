// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'

export const _onlineStatus = new BehaviorSubject<{ online: boolean }>({
  online: true,
})
