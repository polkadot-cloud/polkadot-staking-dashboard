// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { getUnixTime } from 'date-fns'
import { AveragePayoutLine } from 'library/Graphs/AveragePayoutLine'
import { PayoutBar } from 'library/Graphs/PayoutBar'
import { usePoolRewards, useRewards } from 'plugin-staking-api'
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
}
export const ActiveGraph = ({
  nominating,
  inPool,
  lineMarginTop,
  setLastReward,
}: Props) => {
  const { activeEra } = useApi()
  const { network } = useNetwork()
  const { activeAccount } = useActiveAccounts()

  const { data: nominatorRewardData, loading: rewardsLoading } = useRewards({
    chain: network,
    who: activeAccount || '',
    fromEra: Math.max(activeEra.index.minus(1).toNumber(), 0),
  })

  const days = 30
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)
  fromDate.setHours(0, 0, 0, 0)

  const { data: poolRewardsData, loading: poolRewardsLoading } = usePoolRewards(
    {
      chain: network,
      who: activeAccount || '',
      from: getUnixTime(fromDate),
    }
  )

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
        days={days}
        height="150px"
        data={{ payouts, unclaimedPayouts, poolClaims }}
        nominating={nominating}
        inPool={inPool}
        syncing={rewardsLoading || poolRewardsLoading}
      />
      <div style={{ marginTop: lineMarginTop }}>
        <AveragePayoutLine
          days={days}
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
