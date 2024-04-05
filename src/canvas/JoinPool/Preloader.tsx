// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowsRotate, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimary } from 'kits/Buttons/ButtonPrimary';
import { ButtonPrimaryInvert } from 'kits/Buttons/ButtonPrimaryInvert';
import { useOverlay } from 'kits/Overlay/Provider';
import { useTranslation } from 'react-i18next';
import {
  JoinFormWrapper,
  JoinPoolInterfaceWrapper,
  PreloaderWrapper,
} from './Wrappers';
import { PoolSync } from 'library/PoolSync';
import { CallToActionLoader } from 'library/Loader/CallToAction';
import { LoaderWrapper } from 'library/Loader/Wrappers';
import { PageTitleTabs } from 'kits/Structure/PageTitleTabs';
import { CanvasTitleWrapper } from 'canvas/Wrappers';

export const Preloader = () => {
  const { t } = useTranslation();
  const { closeCanvas } = useOverlay().canvas;

  return (
    <>
      <div className="head">
        <ButtonPrimaryInvert
          text={t('chooseAnotherPool', { ns: 'library' })}
          iconLeft={faArrowsRotate}
          disabled
          lg
        />
        <ButtonPrimary
          text={t('pools.back', { ns: 'pages' })}
          lg
          onClick={() => closeCanvas()}
          iconLeft={faTimes}
          style={{ marginLeft: '1.1rem' }}
        />
      </div>
      <CanvasTitleWrapper>
        <div className="inner">
          <div className="empty"></div>
          <div className="standalone">
            <div className="title">
              <h1>{t('syncingPoolData', { ns: 'library' })}...</h1>
            </div>
            <div className="labels">
              <h3>
                {t('analyzingPoolPerformance', { ns: 'library' })}
                <PoolSync label={t('complete', { ns: 'library' })} />
              </h3>
            </div>
          </div>
        </div>
        <PageTitleTabs
          sticky={false}
          tabs={[
            {
              title: t('pools.overview', { ns: 'pages' }),
              active: true,
              onClick: () => {
                /* Do nothing */
              },
              disabled: true,
              asPreloader: true,
            },
            {
              title: t('nominate.nominations', { ns: 'pages' }),
              active: true,
              onClick: () => {
                /* Do nothing */
              },
              disabled: true,
              asPreloader: true,
            },
          ]}
          tabClassName="canvas"
          inline={true}
        />
      </CanvasTitleWrapper>

      <JoinPoolInterfaceWrapper>
        <div className="content">
          <div className="main">
            <PreloaderWrapper>
              <CallToActionLoader />
            </PreloaderWrapper>
          </div>
          <div className="side">
            <div>
              <JoinFormWrapper className="preload">
                <LoaderWrapper style={{ width: '100%', height: '30rem' }} />
              </JoinFormWrapper>
            </div>
          </div>
        </div>
      </JoinPoolInterfaceWrapper>
    </>
  );
};
