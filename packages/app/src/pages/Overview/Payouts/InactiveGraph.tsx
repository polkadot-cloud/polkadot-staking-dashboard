// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PayoutBar } from 'library/Graphs/PayoutBar'
import { PayoutLine } from 'library/Graphs/PayoutLine'
import type { NominatorReward } from 'plugin-staking-api/src/types'
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
      />
      <div style={{ marginTop: '3rem' }}>
        <PayoutLine
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
