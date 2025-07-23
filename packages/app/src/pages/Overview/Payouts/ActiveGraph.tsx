// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useThemeValues } from 'contexts/ThemeValues'
import { getUnixTime, startOfToday, subDays } from 'date-fns'
import { DefaultLocale, locales } from 'locales'
import { usePoolRewards, useRewards } from 'plugin-staking-api'
import type {
  NominatorReward,
  RewardResult,
  RewardResults,
} from 'plugin-staking-api/types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AveragePayoutLine, PayoutBar } from 'ui-graphs'

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
  const { i18n, t } = useTranslation()
  const { activeEra } = useApi()
  const { network } = useNetwork()
  const { activeAddress } = useActiveAccounts()
  const { getThemeValue } = useThemeValues()
  const { unit, units } = getStakingChainData(network)

  const { data: nominatorRewardData, loading: rewardsLoading } = useRewards({
    network,
    who: activeAddress || '',
    fromEra: Math.max(activeEra.index - 1, 0),
  })

  const days = 30
  const fromDate = subDays(startOfToday(), days)

  const { data: poolRewardsData, loading: poolRewardsLoading } = usePoolRewards(
    {
      network,
      who: activeAddress || '',
      from: getUnixTime(fromDate),
    }
  )

  const nominatorRewards = nominatorRewardData?.allRewards ?? []
  const payouts =
    nominatorRewards.filter((reward: NominatorReward) => reward.claimed) ?? []
  const unclaimedPayouts =
    nominatorRewards.filter((reward: NominatorReward) => !reward.claimed) ?? []

  const poolClaims = poolRewardsData?.poolRewards ?? []
  const allRewards = (nominatorRewards as RewardResults)
    .concat(poolClaims)
    .sort((a, b) => b.timestamp - a.timestamp)

  useEffect(() => {
    setLastReward(allRewards[0])
  }, [allRewards.length, allRewards[0]?.timestamp, allRewards[0]?.reward])

  return (
    <>
      <PayoutBar
        days={days}
        height="150px"
        data={{ payouts, unclaimedPayouts, poolClaims }}
        nominating={nominating}
        inPool={inPool}
        syncing={rewardsLoading || poolRewardsLoading}
        getThemeValue={getThemeValue}
        unit={unit}
        units={units}
        dateFormat={locales[i18n.resolvedLanguage ?? DefaultLocale].dateFormat}
        labels={{
          payout: t('payouts', { ns: 'app' }),
          poolClaim: t('poolClaim', { ns: 'app' }),
          unclaimedPayouts: t('unclaimedPayouts', { ns: 'app' }),
          pending: t('pending', { ns: 'app' }),
        }}
      />
      <div style={{ marginTop: lineMarginTop }}>
        <AveragePayoutLine
          days={days}
          average={10}
          height="65px"
          data={{ payouts, unclaimedPayouts, poolClaims }}
          nominating={nominating}
          inPool={inPool}
          getThemeValue={getThemeValue}
          unit={unit}
          units={units}
          labels={{
            payout: t('payouts', { ns: 'app' }),
            dayAverage: t('dayAverage', { ns: 'app' }),
          }}
        />
      </div>
    </>
  )
}
