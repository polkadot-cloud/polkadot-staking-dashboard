// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CardWrapper } from 'library/Card/Wrappers'
import { Nominate } from 'library/SetupSteps/Nominate'
import { Bond } from 'overlay/canvas/CreatePool/Bond'
import { PoolName } from 'overlay/canvas/CreatePool/PoolName'
import { PoolRoles } from 'overlay/canvas/CreatePool/PoolRoles'
import { Summary } from 'overlay/canvas/CreatePool/Summary'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary } from 'ui-buttons'
import { Head, Main, Title } from 'ui-core/canvas'
import { useOverlay } from 'ui-overlay'

export const CreatePool = () => {
  const { t } = useTranslation()
  const { closeCanvas } = useOverlay().canvas

  return (
    <Main>
      <Head>
        <ButtonPrimary
          text={t('close', { ns: 'modals' })}
          size="lg"
          onClick={() => closeCanvas()}
          style={{ marginLeft: '1.1rem' }}
        />
      </Head>
      <Title>
        <h1>{t('pools.createAPool', { ns: 'pages' })}</h1>
      </Title>
      <CardWrapper className="canvas">
        <PoolName section={1} />
      </CardWrapper>
      <CardWrapper className="canvas">
        <Nominate bondFor="pool" section={2} />
      </CardWrapper>
      <CardWrapper className="canvas">
        <PoolRoles section={3} />
      </CardWrapper>
      <CardWrapper className="canvas">
        <Bond section={4} />
      </CardWrapper>
      <CardWrapper className="canvas">
        <Summary section={5} />
      </CardWrapper>
    </Main>
  )
}
