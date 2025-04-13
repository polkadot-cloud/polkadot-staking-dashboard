// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExternalAccount } from '@w3ux/types'
import { BehaviorSubject } from 'rxjs'
import { getInitialExternalAccounts } from '../util'

export const _externalAccounts = new BehaviorSubject<ExternalAccount[]>(
  getInitialExternalAccounts()
)
