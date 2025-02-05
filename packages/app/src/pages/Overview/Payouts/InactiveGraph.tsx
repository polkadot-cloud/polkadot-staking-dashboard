// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AveragePayoutLine } from 'library/Graphs/AveragePayoutLine'
import { PayoutBar } from 'library/Graphs/PayoutBar'
import type { NominatorReward } from 'plugin-staking-api/types'
import { useEffect } from 'react'

export const InactiveGraph = ({
  setLastReward,
}: {
  setLastReward: (reward: NominatorReward | undefined) => void
}) => {
  useEffect(() => {
    setLastReward(undefined)
  }, [])

  return (
    <>
      <PayoutBar
        days={19}
        height="150px"
        data={{ payouts: [], unclaimedPayouts: [], poolClaims: [] }}
        nominating={false}
        inPool={false}
        syncing={false}
      />
      <div style={{ marginTop: '3rem' }}>
        <AveragePayoutLine
          days={19}
          average={10}
          height="65px"
          data={{ payouts: [], unclaimedPayouts: [], poolClaims: [] }}
          nominating={false}
          inPool={false}
        />
      </div>
    </>
  )
}
