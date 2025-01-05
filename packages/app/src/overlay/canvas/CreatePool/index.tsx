// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { CardWrapper } from 'library/Card/Wrappers'
import { Nominate } from 'library/SetupSteps/Nominate'
import { Bond } from 'overlay/canvas/CreatePool/Bond'
import { PoolName } from 'overlay/canvas/CreatePool/PoolName'
import { PoolRoles } from 'overlay/canvas/CreatePool/PoolRoles'
import { Summary } from 'overlay/canvas/CreatePool/Summary'
import {
  CanvasFullScreenWrapper,
  CanvasTitleWrapper,
} from 'overlay/canvas/Wrappers'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary } from 'ui-buttons'
import { useOverlay } from 'ui-overlay'

export const CreatePool = () => {
  const { t } = useTranslation()
  const { closeCanvas } = useOverlay().canvas

  return (
    <CanvasFullScreenWrapper>
      <div className="head">
        <ButtonPrimary
          text={t('pools.back', { ns: 'pages' })}
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
              <h1>{t('pools.createAPool', { ns: 'pages' })}</h1>
            </div>
          </div>
        </div>
      </CanvasTitleWrapper>

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
    </CanvasFullScreenWrapper>
  )
}
