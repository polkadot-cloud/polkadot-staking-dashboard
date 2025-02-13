// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { RewardResults } from 'plugin-staking-api/types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageTitle } from 'ui-core/base'
import { Overview } from './Overview'
import { PayoutHistory } from './PayoutHistory'
import { Wrapper } from './Wrappers'

export const Rewards = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<number>(0)

  const [payoutsList, setPayoutsList] = useState<RewardResults>([])

  const pageProps = {
    payoutsList,
    setPayoutsList,
  }

  return (
    <Wrapper>
      <PageTitle
        title={t('rewards', { ns: 'modals' })}
        tabs={[
          {
            title: t('overview', { ns: 'base' }),
            active: activeTab === 0,
            onClick: () => setActiveTab(0),
          },
          {
            title: t('payouts.payoutHistory', { ns: 'pages' }),
            active: activeTab === 1,
            onClick: () => setActiveTab(1),
          },
        ]}
      />
      {activeTab === 0 && <Overview {...pageProps} />}
      {activeTab === 1 && <PayoutHistory {...pageProps} />}
    </Wrapper>
  )
}
