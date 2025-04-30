// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTimeLeft } from '@w3ux/hooks'
import { secondsFromNow } from '@w3ux/hooks/util'
import BigNumber from 'bignumber.js'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { fromUnixTime, getUnixTime } from 'date-fns'
import { useEraTimeLeft } from 'hooks/useEraTimeLeft'
import { Timeleft } from 'library/StatCards/Timeleft'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { formatTimeleft } from 'utils'

export const NextRewards = () => {
  const { t, i18n } = useTranslation('pages')
  const { activeEra } = useApi()
  const { network } = useNetwork()
  const { get: getEraTimeleft } = useEraTimeLeft()
  const { timeleft, setFromNow } = useTimeLeft({
    depsTimeleft: [network],
    depsFormat: [i18n.resolvedLanguage],
  })
  const timeleftResult = getEraTimeleft()
  const dateFrom = fromUnixTime(Date.now() / 1000)
  const formatted = formatTimeleft(t, timeleft.raw)
  const dateTo = secondsFromNow(timeleftResult.timeleft)

  // Reset timer on era change (also covers network change)
  useEffect(() => {
    setFromNow(dateFrom, dateTo)
  }, [activeEra, getUnixTime(dateTo)])

  const params = {
    label: t('nextRewardDistribution'),
    timeleft: formatted,
    graph: {
      value1: activeEra.index === 0 ? 0 : timeleftResult.percentSurpassed,
      value2: activeEra.index === 0 ? 100 : timeleftResult.percentRemaining,
    },
    tooltip: `Era ${new BigNumber(activeEra.index).toFormat()}`,
  }
  return <Timeleft {...params} />
}
