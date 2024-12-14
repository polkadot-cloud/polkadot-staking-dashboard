// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyApi } from 'common-types'
import { MaxPayoutDays } from 'consts'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import type { PayoutsAndClaims } from 'controllers/Subscan/types'
import { useSubscanData } from 'hooks/useSubscanData'
import { PayoutBar } from 'library/Graphs/PayoutBar'
import { PayoutLine } from 'library/Graphs/PayoutLine'
import { removeNonZeroAmountAndSort } from 'library/Graphs/Utils'
import { ApolloProvider, client, useRewards } from 'plugin-staking-api'
import type { NominatorReward } from 'plugin-staking-api/types'
import { useEffect } from 'react'

export const ActiveGraphInner = ({
  nominating,
  inPool,
  setPayoutLists,
}: {
  nominating: boolean
  inPool: boolean
  setPayoutLists: (payouts: AnyApi[]) => void
}) => {
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
    // filter zero rewards and order via timestamp, most recent first.
    const payoutsList = (allRewards as PayoutsAndClaims).concat(
      poolClaims
    ) as PayoutsAndClaims
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

export const ActiveGraph = (props: {
  nominating: boolean
  inPool: boolean
  setPayoutLists: (payouts: AnyApi[]) => void
}) => (
  <ApolloProvider client={client}>
    <ActiveGraphInner {...props} />
  </ApolloProvider>
)
