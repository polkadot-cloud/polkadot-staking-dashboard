// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Members } from 'overlay/canvas/PoolMembers/Members'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary } from 'ui-buttons'
import { Head, Main, Title } from 'ui-core/canvas'
import { useOverlay } from 'ui-overlay'

export const PoolMembers = () => {
  const { t } = useTranslation()
  const { closeCanvas } = useOverlay().canvas

  return (
    <Main>
      <Head>
        <ButtonPrimary
          text={t('cancel', { ns: 'app' })}
          size="lg"
          onClick={() => closeCanvas()}
          style={{ marginLeft: '1.1rem' }}
        />
      </Head>
      <Title>
        <h1>{t('poolMembers', { ns: 'modals' })}</h1>
      </Title>
      <Members />
    </Main>
  )
}
