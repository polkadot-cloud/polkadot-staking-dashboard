// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { UnclaimedRewards } from 'plugin-staking-api/types'
import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'
import { defaultPayoutsContext } from './defaults'
import type { PayoutsContextInterface } from './types'

export const PayoutsContext = createContext<PayoutsContextInterface>(
  defaultPayoutsContext
)

export const usePayouts = () => useContext(PayoutsContext)

export const PayoutsProvider = ({ children }: { children: ReactNode }) => {
  // Store pending nominator reward total & individual entries.
  const [unclaimedRewards, setUnclaimedRewards] = useState<UnclaimedRewards>({
    total: '0',
    entries: [],
  })

  return (
    <PayoutsContext.Provider
      value={{
        unclaimedRewards,
        setUnclaimedRewards,
      }}
    >
      {children}
    </PayoutsContext.Provider>
  )
}
