// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import { getStakingChainData } from 'consts/util'
import { useThemeValues } from 'contexts/ThemeValues'
import { DefaultLocale, locales } from 'locales'
import { useRewards } from 'plugin-staking-api'
import { useTranslation } from 'react-i18next'
import type { NetworkId } from 'types'
import { PayoutLine } from 'ui-graphs'

interface Props {
  network: NetworkId
  stash: string
  fromEra: number
  width: string | number
  height: string | number
  units: number
}
export const ActiveGraph = ({
  network,
  stash,
  fromEra,
  width,
  height,
  units,
}: Props) => {
  const { i18n, t } = useTranslation()
  const { getThemeValue } = useThemeValues()
  const { unit } = getStakingChainData(network)
  const { data, loading, error } = useRewards({
    network,
    who: stash,
    fromEra,
  })

  const list =
    loading || error || data?.allRewards === undefined
      ? []
      : data.allRewards.map((reward) => ({
          era: reward.era,
          reward: planckToUnit(reward.reward, units),
          start: reward.timestamp,
        }))

  const sorted = [...list].sort((a, b) => a.era - b.era)

  return (
    <PayoutLine
      syncing={loading}
      entries={sorted}
      width={width}
      height={height}
      getThemeValue={getThemeValue}
      unit={unit}
      dateFormat={locales[i18n.resolvedLanguage ?? DefaultLocale].dateFormat}
      labels={{
        era: t('era', { ns: 'app' }),
        reward: t('reward', { ns: 'modals' }),
        payouts: t('payouts', { ns: 'app' }),
      }}
    />
  )
}
