// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

type ValidatorInviteTabsContextInterface = {
  activeTab: number
  setActiveTab: (t: number) => void
}

const ValidatorInviteTabsContext =
  createContext<ValidatorInviteTabsContextInterface>(
    {} as ValidatorInviteTabsContextInterface
  )

export const ValidatorInviteTabsProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [activeTab, setActiveTab] = useState<number>(0)

  return (
    <ValidatorInviteTabsContext.Provider
      value={{
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </ValidatorInviteTabsContext.Provider>
  )
}

export const useValidatorInviteTabs = () =>
  useContext(ValidatorInviteTabsContext)
