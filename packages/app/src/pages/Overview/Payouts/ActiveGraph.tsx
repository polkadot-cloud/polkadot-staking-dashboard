// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useSubscanData } from 'hooks/useSubscanData'
import { PayoutBar } from 'library/Graphs/PayoutBar'
import { PayoutLine } from 'library/Graphs/PayoutLine'
import { ApolloProvider, client, useRewards } from 'plugin-staking-api'
import type { NominatorReward } from 'plugin-staking-api/types'
import { useEffect } from 'react'

interface Props {
  nominating: boolean
  inPool: boolean
  lineMarginTop: string
  setLastReward: (reward: NominatorReward | undefined) => void
}
export const ActiveGraphInner = ({
  nominating,
  inPool,
  lineMarginTop,
  setLastReward,
}: Props) => {
  const { activeEra } = useApi()
  const { network } = useNetwork()
  const { poolClaims } = useSubscanData()
  const { activeAccount } = useActiveAccounts()

  const { data } = useRewards({
    chain: network,
    who: activeAccount || '',
    fromEra: Math.max(activeEra.index.minus(1).toNumber(), 0),
  })
  const allRewards = data?.allRewards ?? []
  const payouts =
    allRewards.filter((reward: NominatorReward) => reward.claimed === true) ??
    []
  const unclaimedPayouts =
    allRewards.filter((reward: NominatorReward) => reward.claimed === false) ??
    []

  useEffect(() => {
    setLastReward(payouts[0])
  }, [JSON.stringify(payouts[0])])

  return (
    <>
      <PayoutBar
        days={19}
        height="150px"
        data={{ payouts, unclaimedPayouts, poolClaims }}
        nominating={nominating}
        inPool={inPool}
      />
      <div style={{ marginTop: lineMarginTop }}>
        <PayoutLine
          days={19}
          average={10}
          height="65px"
          data={{ payouts, unclaimedPayouts, poolClaims }}
          nominating={nominating}
          inPool={inPool}
        />
      </div>
    </>
  )
}

export const ActiveGraph = (props: Props) => (
  <ApolloProvider client={client}>
    <ActiveGraphInner {...props} />
  </ApolloProvider>
)
