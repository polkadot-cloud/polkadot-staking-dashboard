// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import type { Plugin } from 'types'
import { getAvailablePlugins } from './local'

export const _plugins = new BehaviorSubject<Plugin[]>(getAvailablePlugins())
