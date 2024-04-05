// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowsRotate, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimary } from 'kits/Buttons/ButtonPrimary';
import { ButtonPrimaryInvert } from 'kits/Buttons/ButtonPrimaryInvert';
import { useOverlay } from 'kits/Overlay/Provider';
import { useTranslation } from 'react-i18next';
import {
  JoinPoolInterfaceWrapper,
  PreloaderWrapper,
  TitleWrapper,
} from './Wrappers';
import { PoolSync } from 'library/PoolSync';
import { PageTitleTabs } from 'kits/Structure/PageTitleTabs';
import type { PreloaderProps } from './types';
import { CallToActionLoader } from 'library/Loader/CallToAction';

export const Preloader = ({ activeTab, setActiveTab }: PreloaderProps) => {
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
          text={t('cancel', { ns: 'library' })}
          lg
          onClick={() => closeCanvas()}
          iconLeft={faTimes}
          style={{ marginLeft: '1.1rem' }}
        />
      </div>
      <TitleWrapper>
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
              active: activeTab === 0,
              onClick: () => setActiveTab(0),
              disabled: true,
            },
            {
              title: t('nominate.nominations', { ns: 'pages' }),
              active: activeTab === 1,
              onClick: () => setActiveTab(1),
              disabled: true,
            },
          ]}
          tabClassName="canvas"
          inline={true}
        />
      </TitleWrapper>
      <JoinPoolInterfaceWrapper>
        <div className="content">
          <PreloaderWrapper>
            <CallToActionLoader />
          </PreloaderWrapper>
        </div>
      </JoinPoolInterfaceWrapper>
    </>
  );
};
