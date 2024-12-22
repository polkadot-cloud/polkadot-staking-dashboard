// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { PayoutBar } from 'library/Graphs/PayoutBar'
import { PayoutLine } from 'library/Graphs/PayoutLine'
import {
  ApolloProvider,
  client,
  usePoolRewards,
  useRewards,
} from 'plugin-staking-api'
import type {
  NominatorReward,
  RewardResult,
  RewardResults,
} from 'plugin-staking-api/types'
import { useEffect } from 'react'

interface Props {
  nominating: boolean
  inPool: boolean
  lineMarginTop: string
  setLastReward: (reward: RewardResult | undefined) => void
  poolRewardsFrom: number
}
export const ActiveGraphInner = ({
  nominating,
  inPool,
  lineMarginTop,
  setLastReward,
  poolRewardsFrom,
}: Props) => {
  const { activeEra } = useApi()
  const { network } = useNetwork()
  const { activeAccount } = useActiveAccounts()

  const { data: nominatorRewardData } = useRewards({
    chain: network,
    who: activeAccount || '',
    fromEra: Math.max(activeEra.index.minus(1).toNumber(), 0),
  })
  const { data: poolRewardsData } = usePoolRewards({
    chain: network,
    who: activeAccount || '',
    from: poolRewardsFrom,
  })

  const nominatorRewards = nominatorRewardData?.allRewards ?? []
  const payouts =
    nominatorRewards.filter(
      (reward: NominatorReward) => reward.claimed === true
    ) ?? []
  const unclaimedPayouts =
    nominatorRewards.filter(
      (reward: NominatorReward) => reward.claimed === false
    ) ?? []

  const poolClaims = poolRewardsData?.poolRewards ?? []
  const allRewards = (nominatorRewards as RewardResults)
    .concat(poolClaims)
    .sort((a, b) => b.timestamp - a.timestamp)

  useEffect(() => {
    setLastReward(allRewards[0])
  }, [JSON.stringify(allRewards[0])])

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
