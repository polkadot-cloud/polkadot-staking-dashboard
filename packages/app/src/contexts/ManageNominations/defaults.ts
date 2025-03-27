// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ManageNominationsContextInterface } from './types'

export const defaultContext: ManageNominationsContextInterface = {
  defaultNominations: [],
  nominations: [],
  setNominations: () => {},
}
