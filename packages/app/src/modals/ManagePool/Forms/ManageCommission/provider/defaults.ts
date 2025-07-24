// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { PoolCommissionContextInterface } from './types'

export const defaultPoolCommissionContext: PoolCommissionContextInterface = {
  setCommission: (_commission) => {},
  setPayee: (_payee) => {},
  setMaxCommission: (_maxCommission) => {},
  setChangeRate: (_changeRate) => {},
  getInitial: (_feature) => {},
  getCurrent: (_feature) => {},
  getEnabled: (_feature) => false,
  setEnabled: (_feature, _enabled) => {},
  isUpdated: (_feature) => false,
  hasValue: (_feature) => false,
  resetAll: () => {},
}
