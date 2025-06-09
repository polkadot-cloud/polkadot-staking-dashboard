// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useThemeValues } from 'contexts/ThemeValues'
import { DefaultLocale, locales } from 'locales'
import { useTranslation } from 'react-i18next'
import { EraPointsLine } from 'ui-graphs'

export const InactiveGraph = ({
  width,
  height,
}: {
  width: string | number
  height: string | number
}) => {
  const { i18n, t } = useTranslation()
  const { getThemeValue } = useThemeValues()

  return (
    <EraPointsLine
      syncing={false}
      entries={[]}
      width={width}
      height={height}
      getThemeValue={getThemeValue}
      t={t}
      i18n={i18n}
      locales={locales}
      defaultLocale={DefaultLocale}
    />
  )
}
