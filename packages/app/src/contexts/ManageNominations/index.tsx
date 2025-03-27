// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'
import type { Validator } from 'types'
import { defaultContext } from './defaults'
import type { ManageNominationsContextInterface } from './types'

export const ManageNominationsContext =
  createContext<ManageNominationsContextInterface>(defaultContext)

export const useManageNominations = () => useContext(ManageNominationsContext)

export const ManageNominationsProvider = ({
  children,
  nominations: initialNominations,
}: {
  children: ReactNode
  nominations: Validator[]
}) => {
  // The initially provided set of nominations
  const [defaultNominations] = useState<Validator[]>(initialNominations)

  // The set of nominations, defaults to initial provided nominations
  const [nominations, setNominations] =
    useState<Validator[]>(initialNominations)

  return (
    <ManageNominationsContext.Provider
      value={{
        defaultNominations,
        nominations,
        setNominations,
      }}
    >
      {children}
    </ManageNominationsContext.Provider>
  )
}
