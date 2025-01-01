// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { FastUnstakeContextInterface } from './types'

export const defaultFastUnstakeContext: FastUnstakeContextInterface = {
  exposed: false,
  head: undefined,
  queueDeposit: undefined,
  counterForQueue: undefined,
  fastUnstakeStatus: null,
  setFastUnstakeStatus: (status) => {},
}
