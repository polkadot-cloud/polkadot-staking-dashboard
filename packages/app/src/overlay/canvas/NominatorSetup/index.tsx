// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useOverlay } from 'kits/Overlay/Provider'
import { CardWrapper } from 'library/Card/Wrappers'
import { Nominate } from 'library/SetupSteps/Nominate'
import { Bond } from 'overlay/canvas/NominatorSetup/Bond'
import { Payee } from 'overlay/canvas/NominatorSetup/Payee'
import { Summary } from 'overlay/canvas/NominatorSetup/Summary'
import {
  CanvasFullScreenWrapper,
  CanvasTitleWrapper,
} from 'overlay/canvas/Wrappers'
import { useTranslation } from 'react-i18next'
import { Element } from 'react-scroll'
import { ButtonPrimary } from 'ui-buttons'

export const NominatorSetup = () => {
  const { t } = useTranslation('pages')
  const { closeCanvas } = useOverlay().canvas

  return (
    <CanvasFullScreenWrapper>
      <div className="head">
        <ButtonPrimary
          text={t('pools.back')}
          lg
          onClick={() => closeCanvas()}
          iconLeft={faTimes}
          style={{ marginLeft: '1.1rem' }}
        />
      </div>

      <CanvasTitleWrapper>
        <div className="inner standalone">
          <div className="empty"></div>
          <div className="standalone">
            <div className="title">
              <h1>{t('nominate.startNominating')}</h1>
            </div>
          </div>
        </div>
      </CanvasTitleWrapper>

      <CardWrapper className="canvas">
        <Element name="payee" style={{ position: 'absolute' }} />
        <Payee section={1} />
      </CardWrapper>

      <CardWrapper className="canvas">
        <Element name="nominate" style={{ position: 'absolute' }} />
        <Nominate bondFor="nominator" section={2} />
      </CardWrapper>

      <CardWrapper className="canvas">
        <Element name="bond" style={{ position: 'absolute' }} />
        <Bond section={3} />
      </CardWrapper>

      <CardWrapper className="canvas">
        <Element name="summary" style={{ position: 'absolute' }} />
        <Summary section={4} />
      </CardWrapper>
    </CanvasFullScreenWrapper>
  )
}
