// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils'
import type { NominatorSetups } from './types'

// Utility to get nominator setups, type casted as NominatorSetups
export const localNominatorSetups = () =>
  localStorageOrDefault('nominator_setups', {}, true) as NominatorSetups
