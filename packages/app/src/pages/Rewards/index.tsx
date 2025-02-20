// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MaxPayoutDays } from 'consts'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { getUnixTime } from 'date-fns'
import { removeNonZeroAmountAndSort } from 'library/Graphs/Utils'
import { fetchPoolRewards, fetchRewards } from 'plugin-staking-api'
import type { NominatorReward, RewardResults } from 'plugin-staking-api/types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from 'ui-core/base'
import { Overview } from './Overview'
import { RecentPayouts } from './RecentPayouts'
import { Wrapper } from './Wrappers'
import type { PayoutGraphData } from './types'

export const Rewards = () => {
  const { t } = useTranslation()
  const { activeEra } = useApi()
  const { network } = useNetwork()
  const { pluginEnabled } = usePlugins()
  const { activeAccount } = useActiveAccounts()

  // Store page active tab
  const [activeTab, setActiveTab] = useState<number>(0)

  // Store payouts list in state, fetched by Staking API
  const [payoutsList, setPayoutsList] = useState<RewardResults>([])

  // Store whether data is being fetched
  const [loading, setLoading] = useState<boolean>(false)

  // Store payout graph data.
  const [payoutGraphData, setPayoutGraphData] = useState<PayoutGraphData>({
    payouts: [],
    unclaimedPayouts: [],
    poolClaims: [],
  })

  // Payouts list props to pass to each tab
  const pageProps = {
    payoutsList,
    setPayoutsList,
  }

  // Get payout data on account or staking api toggle
  const getPayoutData = async () => {
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - MaxPayoutDays)
    fromDate.setHours(0, 0, 0, 0)

    const [allRewards, poolRewards] = await Promise.all([
      fetchRewards(
        network,
        activeAccount || '',
        Math.max(activeEra.index.minus(1).toNumber(), 0)
      ),
      fetchPoolRewards(network, activeAccount || '', getUnixTime(fromDate)),
    ])

    const payouts =
      allRewards.filter((reward: NominatorReward) => reward.claimed === true) ??
      []
    const unclaimedPayouts =
      allRewards.filter(
        (reward: NominatorReward) => reward.claimed === false
      ) ?? []
    const poolClaims = poolRewards ?? []

    // Filter zero rewards and order via timestamp, most recent first
    setPayoutsList(
      removeNonZeroAmountAndSort(
        (allRewards as RewardResults).concat(poolClaims) as RewardResults
      )
    )
    setPayoutGraphData({ payouts, unclaimedPayouts, poolClaims })
    setLoading(false)
  }

  // Fetch payout data on account or staking api toggle
  useEffect(() => {
    if (!pluginEnabled('staking_api')) {
      setPayoutsList([])
      setPayoutGraphData({
        payouts: [],
        unclaimedPayouts: [],
        poolClaims: [],
      })
    } else if (activeAccount && activeEra.index.isGreaterThan(0)) {
      setLoading(true)
      getPayoutData()
    }
  }, [network, activeAccount, pluginEnabled('staking_api'), activeEra.index])

  // Reset payout list state on account change
  useEffect(() => {
    setPayoutsList([])
  }, [activeAccount])

  return (
    <Wrapper>
      <Page.Title
        title={t('rewards', { ns: 'modals' })}
        tabs={[
          {
            title: t('overview', { ns: 'base' }),
            active: activeTab === 0,
            onClick: () => setActiveTab(0),
          },
          {
            title: t('payouts.recentPayouts', { ns: 'pages' }),
            active: activeTab === 1,
            onClick: () => setActiveTab(1),
          },
        ]}
      />
      {activeTab === 0 && (
        <Overview
          {...pageProps}
          payoutGraphData={payoutGraphData}
          loading={loading}
        />
      )}
      {activeTab === 1 && <RecentPayouts {...pageProps} />}
    </Wrapper>
  )
}
