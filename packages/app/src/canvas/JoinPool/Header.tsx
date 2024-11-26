// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faArrowsRotate,
  faHashtag,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Polkicon } from '@w3ux/react-polkicon';
import { CanvasTitleWrapper } from 'canvas/Wrappers';
import { determinePoolDisplay } from 'contexts/Pools/util';
import { useOverlay } from 'kits/Overlay/Provider';
import { useTranslation } from 'react-i18next';
import { ButtonPrimary, ButtonPrimaryInvert } from 'ui-buttons';
import { PageTitleTabs } from 'ui-structure';
import type { JoinPoolHeaderProps } from './types';

export const Header = ({
  activeTab,
  bondedPool,
  filteredBondedPools,
  metadata,
  autoSelected,
  setActiveTab,
  setSelectedPoolId,
  providedPoolId,
}: JoinPoolHeaderProps) => {
  const { t } = useTranslation();
  const { closeCanvas } = useOverlay().canvas;

  // Randomly select a new pool to display.
  const handleChooseNewPool = () => {
    // Remove current pool from filtered so it is not selected again.
    const filteredPools = filteredBondedPools.filter(
      (pool) => String(pool.id) !== String(bondedPool.id)
    );

    // Randomly select a filtered bonded pool and set it as the selected pool.
    const index = Math.ceil(Math.random() * filteredPools.length - 1);
    setSelectedPoolId(filteredPools[index].id);
  };

  return (
    <>
      <div className="head">
        {providedPoolId === null && (
          <ButtonPrimaryInvert
            text={t('chooseAnotherPool', { ns: 'library' })}
            iconLeft={faArrowsRotate}
            onClick={() => handleChooseNewPool()}
            lg
          />
        )}
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
          <div>
            <Polkicon
              address={bondedPool?.addresses.stash || ''}
              background="transparent"
              fontSize="4rem"
            />
          </div>
          <div>
            <div className="title">
              <h1>
                {determinePoolDisplay(
                  bondedPool?.addresses.stash || '',
                  metadata
                )}
              </h1>
            </div>
            <div className="labels">
              <h3>
                {t('pool', { ns: 'library' })}{' '}
                <FontAwesomeIcon icon={faHashtag} transform="shrink-2" />
                {bondedPool.id}
                {['Blocked', 'Destroying'].includes(bondedPool.state) && (
                  <span className={bondedPool.state.toLowerCase()}>
                    {t(bondedPool.state.toLowerCase(), { ns: 'library' })}
                  </span>
                )}
              </h3>

              {autoSelected && (
                <h3>
                  <span>{t('autoSelected', { ns: 'library' })}</span>
                </h3>
              )}
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
            },
            {
              title: t('nominate.nominations', { ns: 'pages' }),
              active: activeTab === 1,
              onClick: () => setActiveTab(1),
            },
          ]}
          tabClassName="canvas"
          inline={true}
          colorSecondary={true}
        />
      </CanvasTitleWrapper>
    </>
  );
};
