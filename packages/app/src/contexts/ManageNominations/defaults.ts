// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ManageNominationsContextInterface } from './types'

export const defaultContext: ManageNominationsContextInterface = {
  method: null,
  setMethod: () => {},
  fetching: false,
  setFetching: () => {},
  height: null,
  setHeight: () => {},
  defaultNominations: [],
  nominations: [],
  setNominations: () => {},
  heightRef: { current: null },
  updateSetters: (setters, newNominations) => {},
  resetNominations: (setters) => {},
  revertNominations: () => {},
}
