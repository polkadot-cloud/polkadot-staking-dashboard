// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { shuffle } from '@w3ux/utils'
import type { ValidatorEntry } from '@w3ux/validator-assets'
import { ValidatorCommunity } from '@w3ux/validator-assets'
import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'
import { defaultOperatorsContext } from './defaults'
import type { OperatorsContextInterface } from './types'

export const OperatorsContext = createContext<OperatorsContextInterface>(
  defaultOperatorsContext
)

export const useOperators = () => useContext(OperatorsContext)

export const OperatorsProvider = ({ children }: { children: ReactNode }) => {
  // Stores a randomised validator operators dataset
  const [validatorOperators] = useState<ValidatorEntry[]>([
    ...shuffle(ValidatorCommunity),
  ])

  return (
    <OperatorsContext.Provider value={{ validatorOperators }}>
      {children}
    </OperatorsContext.Provider>
  )
}
