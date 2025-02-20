// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LearningGuide } from 'pages/Learning/paths'
import React, { createContext, useContext, useState } from 'react'

interface LearningState {
  activePath: string | null
  activeGuide: LearningGuide | null
  setActivePath: (path: string) => void
  setActiveGuide: (guide: LearningGuide | null) => void
}

// Default state
const defaultLearningState: LearningState = {
  activePath: null,
  activeGuide: null,
  setActivePath: () => {},
  setActiveGuide: () => {},
}

// Create context
const LearningContext = createContext<LearningState>(defaultLearningState)

// Provider component
export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activePath, setActivePath] = useState<string | null>(null)
  const [activeGuide, setActiveGuide] = useState<LearningGuide | null>(null)

  return (
    <LearningContext.Provider
      value={{
        activePath,
        activeGuide,
        setActivePath,
        setActiveGuide,
      }}
    >
      {children}
    </LearningContext.Provider>
  )
}

// Custom hook for using the context
export const useLearningState = () => useContext(LearningContext)
