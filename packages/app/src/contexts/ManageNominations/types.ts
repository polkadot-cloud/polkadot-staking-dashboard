// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Dispatch, SetStateAction } from 'react'
import type { Validator } from 'types'

export interface ManageNominationsContextInterface {
  defaultNominations: Validator[]
  nominations: Validator[]
  setNominations: Dispatch<SetStateAction<Validator[]>>
}
