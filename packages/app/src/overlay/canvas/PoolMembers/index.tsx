// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Members } from 'overlay/canvas/PoolMembers/Members'
import { useTranslation } from 'react-i18next'
import { Head, Main, Title } from 'ui-core/canvas'
import { CloseCanvas } from 'ui-overlay'

export const PoolMembers = () => {
  const { t } = useTranslation()

  return (
    <Main>
      <Head>
        <CloseCanvas />
      </Head>
      <Title>
        <h1>{t('poolMembers', { ns: 'modals' })}</h1>
      </Title>
      <Members />
    </Main>
  )
}
