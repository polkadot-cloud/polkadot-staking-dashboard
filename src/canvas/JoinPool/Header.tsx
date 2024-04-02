// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faArrowsRotate,
  faHashtag,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimary } from 'kits/Buttons/ButtonPrimary';
import { ButtonPrimaryInvert } from 'kits/Buttons/ButtonPrimaryInvert';
import { TitleWrapper } from './Wrappers';
import { Polkicon } from '@w3ux/react-polkicon';
import { determinePoolDisplay, remToUnit } from '@w3ux/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PageTitleTabs } from 'kits/Structure/PageTitleTabs';
import { useTranslation } from 'react-i18next';
import { useOverlay } from 'kits/Overlay/Provider';
import type { JoinPoolHeaderProps } from './types';

export const Header = ({
  activeTab,
  bondedPool,
  filteredBondedPools,
  metadata,
  autoSelected,
  setActiveTab,
  setSelectedPoolId,
  setSelectedPoolCount,
}: JoinPoolHeaderProps) => {
  const { t } = useTranslation();
  const { closeCanvas } = useOverlay().canvas;

  // Randomly select a new pool to display.
  const handleChooseNewPool = () => {
    // Trigger refresh of memoied selected bonded pool.
    setSelectedPoolCount((prev: number) => prev + 1);

    // Randomly select a filtered bonded pool and set it as the selected pool.
    const index = Math.ceil(Math.random() * filteredBondedPools.length - 1);
    setSelectedPoolId(filteredBondedPools[index].id);
  };

  return (
    <>
      <div className="head">
        <ButtonPrimaryInvert
          text={'Choose Another Pool'}
          iconLeft={faArrowsRotate}
          onClick={() => handleChooseNewPool()}
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
          <div>
            <Polkicon
              address={bondedPool?.addresses.stash || ''}
              size={remToUnit('4rem')}
              outerColor="transparent"
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
                Pool <FontAwesomeIcon icon={faHashtag} transform="shrink-2" />
                {bondedPool.id}
                {['Blocked', 'Destroying'].includes(bondedPool.state) && (
                  <span className={bondedPool.state.toLowerCase()}>
                    {bondedPool.state}
                  </span>
                )}
              </h3>

              {autoSelected && (
                <h3>
                  <span>Auto Selected</span>
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
              title: 'Nominations',
              active: activeTab === 1,
              onClick: () => setActiveTab(1),
            },
          ]}
          tabClassName="canvas"
          inline={true}
        />
      </TitleWrapper>
    </>
  );
};
