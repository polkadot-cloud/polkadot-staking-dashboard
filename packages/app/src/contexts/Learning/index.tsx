// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { createContext, useContext, useState } from 'react'
import { defaultLearningContext } from './default'
import type { Guide, LearningContextState } from './types'

export const LearningContext = createContext<LearningContextState>(
  defaultLearningContext
)

export const useLearningState = () => useContext(LearningContext)

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activePath, setActivePath] = useState<string | null>(null)
  const [activeGuide, setActiveGuide] = useState<Guide | null>(null)

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
