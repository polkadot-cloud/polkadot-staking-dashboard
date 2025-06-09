// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MaxPayoutDays } from 'consts'
import { getStakingChainData } from 'consts/util'
import { useNetwork } from 'contexts/Network'
import { useThemeValues } from 'contexts/ThemeValues'
import type { PayoutHistoryProps } from 'pages/Rewards/types'
import { useTranslation } from 'react-i18next'
import { AveragePayoutLine, PayoutBar } from 'ui-graphs'

type Props = Omit<
  PayoutHistoryProps & {
    nominating: boolean
    inPool: boolean
  },
  'payoutsList' | 'setPayoutsList'
>

export const ActiveGraph = ({
  nominating,
  inPool,
  payoutGraphData: { payouts, unclaimedPayouts, poolClaims },
  loading,
}: Props) => {
  const { i18n, t } = useTranslation()
  const { network } = useNetwork()
  const { getThemeValue } = useThemeValues()
  const { unit, units } = getStakingChainData(network)

  return (
    <>
      <PayoutBar
        days={MaxPayoutDays}
        height="165px"
        data={{ payouts, unclaimedPayouts, poolClaims }}
        nominating={nominating}
        inPool={inPool}
        syncing={loading}
        getThemeValue={getThemeValue}
        unit={unit}
        units={units}
        i18n={i18n}
        labels={{
          payout: t('payouts', { ns: 'app' }),
          poolClaim: t('poolClaim', { ns: 'app' }),
          unclaimedPayouts: t('unclaimedPayouts', { ns: 'app' }),
          pending: t('pending', { ns: 'app' }),
        }}
      />
      <div style={{ marginTop: '1rem' }}>
        <AveragePayoutLine
          days={MaxPayoutDays}
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
