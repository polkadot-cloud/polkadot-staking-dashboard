// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getStakingChainData } from 'consts/util'
import { useNetwork } from 'contexts/Network'
import { useThemeValues } from 'contexts/ThemeValues'
import { DefaultLocale, locales } from 'locales'
import { useTranslation } from 'react-i18next'
import { PayoutLine } from 'ui-graphs'

export const InactiveGraph = ({
  width,
  height,
}: {
  width: string | number
  height: string | number
}) => {
  const { i18n, t } = useTranslation()
  const { network } = useNetwork()
  const { getThemeValue } = useThemeValues()
  const { unit } = getStakingChainData(network)

  return (
    <PayoutLine
      syncing={false}
      entries={[]}
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
