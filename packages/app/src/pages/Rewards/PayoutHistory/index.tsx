// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { Page } from 'ui-core/base'
import type { PageProps } from '../types'
import { PayoutList } from './PayoutList'

export const PayoutHistory = (props: PageProps) => {
  const { payoutsList } = props
  const { t } = useTranslation('pages')

  return (
    <Page.Row>
      <CardWrapper>
        <PayoutList
          title={t('payouts.recentPayouts')}
          payouts={payoutsList}
          pagination
          itemsPerPage={50}
        />
      </CardWrapper>
    </Page.Row>
  )
}
