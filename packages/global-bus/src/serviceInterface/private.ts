// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import type { ServiceInterface } from 'types'
import { defaultServiceInterface } from './default'

export const _serviceInterface = new BehaviorSubject<ServiceInterface>(
  defaultServiceInterface
)
