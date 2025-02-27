// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { PoolCommissionContextInterface } from './types'

export const defaultPoolCommissionContext: PoolCommissionContextInterface = {
  setCommission: (commission) => {},
  setPayee: (payee) => {},
  setMaxCommission: (maxCommission) => {},
  setChangeRate: (changeRate) => {},
  getInitial: (feature) => {},
  getCurrent: (feature) => {},
  getEnabled: (feature) => false,
  setEnabled: (feature, enabled) => {},
  isUpdated: (feature) => false,
  hasValue: (feature) => false,
  resetAll: () => {},
}
