// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import { getStakingChainData } from 'consts/util'
import { useThemeValues } from 'contexts/ThemeValues'
import { DefaultLocale, locales } from 'locales'
import { useValidatorRewards } from 'plugin-staking-api'
import { useTranslation } from 'react-i18next'
import type { NetworkId } from 'types'
import { PayoutLine } from 'ui-graphs'

interface Props {
  network: NetworkId
  validator: string
  fromEra: number
  width: string | number
  height: string | number
}
export const ActiveGraph = ({
  network,
  validator,
  fromEra,
  width,
  height,
}: Props) => {
  const { i18n, t } = useTranslation()
  const { getThemeValue } = useThemeValues()
  const { data, loading, error } = useValidatorRewards({
    network,
    validator,
    fromEra,
  })
  const { units, unit } = getStakingChainData(network)

  const list =
    loading || error || data?.validatorRewards === undefined
      ? []
      : data.validatorRewards.map((reward) => ({
          era: reward.era,
          reward: planckToUnit(reward.reward, units),
          start: reward.start,
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
      t={t}
      i18n={i18n}
      locales={locales}
      defaultLocale={DefaultLocale}
    />
  )
}
