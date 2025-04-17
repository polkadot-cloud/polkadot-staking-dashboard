// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import type { ExternalAccount } from 'types'
import { getInitialExternalAccounts } from '../util'

export const _externalAccounts = new BehaviorSubject<ExternalAccount[]>(
  getInitialExternalAccounts()
)
