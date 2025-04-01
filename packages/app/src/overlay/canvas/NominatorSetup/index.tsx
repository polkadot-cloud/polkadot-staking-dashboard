// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CardWrapper } from 'library/Card/Wrappers'
import { Nominate } from 'library/SetupSteps/Nominate'
import { Bond } from 'overlay/canvas/NominatorSetup/Bond'
import { Payee } from 'overlay/canvas/NominatorSetup/Payee'
import { Summary } from 'overlay/canvas/NominatorSetup/Summary'
import { useTranslation } from 'react-i18next'
import { Head, Main, Title } from 'ui-core/canvas'
import { CloseCanvas } from 'ui-overlay'

export const NominatorSetup = () => {
  const { t } = useTranslation('pages')

  return (
    <Main>
      <Head>
        <CloseCanvas />
      </Head>
      <Title>
        <h1>{t('startNominating')}</h1>
      </Title>
      <CardWrapper className="canvas">
        <Payee section={1} />
      </CardWrapper>
      <CardWrapper className="canvas">
        <Nominate bondFor="nominator" section={2} />
      </CardWrapper>
      <CardWrapper className="canvas">
        <Bond section={3} />
      </CardWrapper>
      <CardWrapper className="canvas">
        <Summary section={4} />
      </CardWrapper>
    </Main>
  )
}
