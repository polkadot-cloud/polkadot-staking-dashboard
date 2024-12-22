// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyApi } from 'common-types'
import { MaxPayoutDays } from 'consts'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { PayoutBar } from 'library/Graphs/PayoutBar'
import { PayoutLine } from 'library/Graphs/PayoutLine'
import { removeNonZeroAmountAndSort } from 'library/Graphs/Utils'
import {
  ApolloProvider,
  client,
  usePoolRewards,
  useRewards,
} from 'plugin-staking-api'
import type { NominatorReward, RewardResult } from 'plugin-staking-api/types'
import { useEffect } from 'react'

interface Props {
  nominating: boolean
  inPool: boolean
  setPayoutLists: (payouts: AnyApi[]) => void
  poolRewardsFrom: number
}

export const ActiveGraphInner = ({
  nominating,
  inPool,
  setPayoutLists,
  poolRewardsFrom,
}: Props) => {
  const { activeEra } = useApi()
  const { network } = useNetwork()
  const { activeAccount } = useActiveAccounts()

  const { data: nominatorRewardsData } = useRewards({
    chain: network,
    who: activeAccount || '',
    fromEra: Math.max(activeEra.index.minus(1).toNumber(), 0),
  })
  const { data: poolRewardsData } = usePoolRewards({
    chain: network,
    who: activeAccount || '',
    from: poolRewardsFrom,
  })

  const allRewards = nominatorRewardsData?.allRewards ?? []
  const payouts =
    allRewards.filter((reward: NominatorReward) => reward.claimed === true) ??
    []
  const unclaimedPayouts =
    allRewards.filter((reward: NominatorReward) => reward.claimed === false) ??
    []
  const poolClaims = poolRewardsData?.poolRewards ?? []

  useEffect(() => {
    // filter zero rewards and order via timestamp, most recent first
    const payoutsList = (allRewards as RewardResult).concat(
      poolClaims
    ) as RewardResult
    setPayoutLists(removeNonZeroAmountAndSort(payoutsList))
  }, [JSON.stringify(payouts), JSON.stringify(poolClaims)])

  return (
    <>
      <PayoutBar
        days={MaxPayoutDays}
        height="165px"
        data={{ payouts, unclaimedPayouts, poolClaims }}
        nominating={nominating}
        inPool={inPool}
      />
      <PayoutLine
        days={MaxPayoutDays}
        average={10}
        height="65px"
        data={{ payouts, unclaimedPayouts, poolClaims }}
        nominating={nominating}
        inPool={inPool}
      />
    </>
  )
}

export const ActiveGraph = (props: Props) => (
  <ApolloProvider client={client}>
    <ActiveGraphInner {...props} />
  </ApolloProvider>
)
