// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { Element } from 'react-scroll';
import { CardWrapper } from 'library/Card/Wrappers';
import { Nominate } from 'library/SetupSteps/Nominate';
import { Summary } from 'canvas/CreatePool/Summary';
import { Bond } from 'canvas/CreatePool/Bond';
import { PoolName } from 'canvas/CreatePool/PoolName';
import { PoolRoles } from 'canvas/CreatePool/PoolRoles';
import { CanvasFullScreenWrapper, CanvasTitleWrapper } from 'canvas/Wrappers';
import { ButtonPrimary } from 'ui-buttons';
import { useOverlay } from 'kits/Overlay/Provider';

export const CreatePool = () => {
  const { t } = useTranslation();
  const { closeCanvas } = useOverlay().canvas;

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
        <Element name="metadata" style={{ position: 'absolute' }} />
        <PoolName section={1} />
      </CardWrapper>

      <CardWrapper className="canvas">
        <Element name="nominate" style={{ position: 'absolute' }} />
        <Nominate bondFor="pool" section={2} />
      </CardWrapper>

      <CardWrapper className="canvas">
        <Element name="roles" style={{ position: 'absolute' }} />
        <PoolRoles section={3} />
      </CardWrapper>

      <CardWrapper className="canvas">
        <Element name="bond" style={{ position: 'absolute' }} />
        <Bond section={4} />
      </CardWrapper>

      <CardWrapper className="canvas">
        <Element name="summary" style={{ position: 'absolute' }} />
        <Summary section={5} />
      </CardWrapper>
    </CanvasFullScreenWrapper>
  );
};
