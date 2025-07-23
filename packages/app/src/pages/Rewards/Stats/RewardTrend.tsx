// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { getPoolMembership } from 'global-bus'
import { useErasPerDay } from 'hooks/useErasPerDay'
import { Ticker } from 'library/StatCards/Ticker'
import {
  fetchNominatorRewardTrend,
  fetchPoolRewardTrend,
} from 'plugin-staking-api'
import type { RewardTrend as IRewardTrend } from 'plugin-staking-api/types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const RewardTrend = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { activeEra } = useApi()
  const { isBonding } = useStaking()
  const { erasPerDay } = useErasPerDay()
  const { activeAddress } = useActiveAccounts()

  const { unit, units } = getStakingChainData(network)
  const { membership } = getPoolMembership(activeAddress)
  const eras = erasPerDay * 30
  // NOTE: 30 day duration in seconds
  const duration = 2592000

  // Store the reward trend result
  const [rewardTrend, setRewardTrend] = useState<IRewardTrend | null>(null)

  // Fetch the reward trend on account, network changes. Ensure the active era is greater than 0
  const getRewardTrend = async () => {
    if (activeAddress && activeEra.index > 0) {
      const result = membership
        ? await fetchPoolRewardTrend(network, activeAddress, duration)
        : await fetchNominatorRewardTrend(network, activeAddress, eras)
      setRewardTrend(result)
    }
  }

  useEffect(() => {
    setRewardTrend(null)
    if (isBonding || membership) {
      getRewardTrend()
    }
  }, [
    activeAddress,
    network,
    activeEra.index.toString(),
    membership,
    isBonding,
  ])

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
    label: t('last30DayReward'),
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
