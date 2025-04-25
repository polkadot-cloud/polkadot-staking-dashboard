// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { StakingLedger } from 'types'

export const defaultStakingLedger: StakingLedger = {
  ledger: undefined,
  payee: undefined,
  nominators: undefined,
  poolMembership: undefined,
  controllerUnmigrated: false,
}
