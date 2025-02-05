// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ActivePoolContextState } from './types'

export const nominationStatus = {}

export const defaultPoolRoles = {
  depositor: '',
  nominator: '',
  root: '',
  bouncer: '',
}

export const defaultPoolNominations = {
  targets: [],
  submittedIn: 0,
}

export const defaultActivePoolContext: ActivePoolContextState = {
  inPool: () => false,
  isBonding: () => false,
  isNominator: () => false,
  isOwner: () => false,
  isMember: () => false,
  isDepositor: () => false,
  isBouncer: () => false,
  getPoolUnlocking: () => [],
  getPoolRoles: () => defaultPoolRoles,
  activePool: null,
  activePoolNominations: null,
}
