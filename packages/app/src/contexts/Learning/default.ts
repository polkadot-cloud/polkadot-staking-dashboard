// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LearningContextState } from './types'

export const defaultLearningContext: LearningContextState = {
  activePath: null,
  activeGuide: null,
  setActivePath: () => {},
  setActiveGuide: () => {},
}
