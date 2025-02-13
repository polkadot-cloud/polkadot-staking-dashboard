// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help'
import { CardWrapper } from 'library/Card/Wrappers'
import { getPayoutsFromDate, getPayoutsToDate } from 'library/Graphs/Utils'
import { DefaultLocale, locales } from 'locales'
import { useTranslation } from 'react-i18next'
import { ButtonHelp } from 'ui-buttons'
import { CardHeader, PageRow, StatRow } from 'ui-core/base'
import { LastEraPayout } from '../Stats/LastEraPayout'
import type { PageProps } from '../types'
import { PayoutList } from './PayoutList'
import { RecentPayouts } from './RecentPayouts'

export const PayoutHistory = (props: PageProps) => {
  const { payoutsList } = props

  const { i18n, t } = useTranslation('pages')
  const { openHelp } = useHelp()
  const payoutsFromDate = getPayoutsFromDate(
    payoutsList,
    locales[i18n.resolvedLanguage ?? DefaultLocale].dateFormat
  )
  const payoutsToDate = getPayoutsToDate(
    payoutsList,
    locales[i18n.resolvedLanguage ?? DefaultLocale].dateFormat
  )

  return (
    <>
      <StatRow>
        <LastEraPayout />
      </StatRow>
      <PageRow>
        <CardWrapper>
          <CardHeader>
            <h4>
              {t('payouts.payoutHistory')}
              <ButtonHelp
                marginLeft
                onClick={() => openHelp('Payout History')}
              />
            </h4>
            <h2>
              {payoutsFromDate && payoutsToDate ? (
                <>
                  {payoutsFromDate}
                  {payoutsToDate !== payoutsFromDate && (
                    <>&nbsp;-&nbsp;{payoutsToDate}</>
                  )}
                </>
              ) : (
                t('payouts.none')
              )}
            </h2>
          </CardHeader>
          <RecentPayouts {...props} />
        </CardWrapper>
      </PageRow>
      {!!payoutsList?.length && (
        <PageRow>
          <CardWrapper>
            <PayoutList
              title={t('payouts.recentPayouts')}
              payouts={payoutsList}
              pagination
              itemsPerPage={50}
            />
          </CardWrapper>
        </PageRow>
      )}
    </>
  )
}
