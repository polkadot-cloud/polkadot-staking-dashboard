// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import type { UnclaimedRewards } from 'plugin-staking-api/types'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { defaultUnclaimedRewards } from './defaults'
import type { PayoutsContextInterface } from './types'

export const [PayoutsContext, usePayouts] =
  createSafeContext<PayoutsContextInterface>()

export const PayoutsProvider = ({ children }: { children: ReactNode }) => {
  const [unclaimedRewards, setUnclaimedRewards] = useState<UnclaimedRewards>(
    defaultUnclaimedRewards
  )

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
