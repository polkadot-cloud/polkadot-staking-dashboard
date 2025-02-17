// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface Guide {
  id: string
}

export interface Path {
  id: string
  guides: Guide[]
}

export interface LearningContextState {
  activePath: string | null
  activeGuide: Guide | null
  setActivePath: (path: string) => void
  setActiveGuide: (guide: Guide | null) => void
}
