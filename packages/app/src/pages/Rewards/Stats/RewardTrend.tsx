// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useErasPerDay } from 'hooks/useErasPerDay'
import { Ticker } from 'library/StatCards/Ticker'
import { fetchRewardTrend } from 'plugin-staking-api'
import type { RewardTrend as IRewardTrend } from 'plugin-staking-api/types'
import { useEffect, useState } from 'react'

export const RewardTrend = () => {
  // const { t } = useTranslation('pages')
  const {
    network,
    networkData: { unit, units },
  } = useNetwork()
  const { activeEra } = useApi()
  const { erasPerDay } = useErasPerDay()
  const { activeAccount } = useActiveAccounts()
  const eras = erasPerDay.multipliedBy(30).toNumber()

  // Store the reward trend result
  const [rewardTrend, setRewardTrend] = useState<IRewardTrend | null>(null)

  // Fetch the reward trend on account, network changes. Ensure the active era is greater than 0
  const getRewardTrend = async () => {
    if (activeAccount && activeEra.index.isGreaterThan(0)) {
      const result = await fetchRewardTrend(network, activeAccount, eras)
      setRewardTrend(result)
    }
  }
  useEffect(() => {
    setRewardTrend(null)
    getRewardTrend()
  }, [activeAccount, network, activeEra.index.toString()])

  // Format the reward trend data
  let value = '0'
  let direction: 'up' | 'down' | undefined = undefined
  let changePercent = '0'
  if (rewardTrend) {
    const { reward, change } = rewardTrend
    value = reward
    direction = Number(change.percent) > 0 ? 'up' : 'down'
    changePercent = new BigNumber(change.percent).toFormat(2)
  }

  const params = {
    // TODO: Move to locale
    label: 'Last 30 Days Reward',
    value: new BigNumber(planckToUnit(value, units))
      .decimalPlaces(3)
      .toFormat(),
    decimals: 3,
    unit,
    direction,
    changePercent,
  }
  return <Ticker {...params} />
}
