// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

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
  isBonding: () => false,
  isNominator: () => false,
  isOwner: () => false,
  isMember: () => false,
  isDepositor: () => false,
  isBouncer: () => false,
  getPoolUnlocking: () => [],
  getPoolRoles: () => defaultPoolRoles,
  setActivePoolId: (p) => {},
  activePool: null,
  activePoolNominations: null,
}
