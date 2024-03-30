// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowsRotate, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CanvasFullScreenWrapper } from 'canvas/Wrappers';
import { ButtonPrimary } from 'kits/Buttons/ButtonPrimary';
import { ButtonPrimaryInvert } from 'kits/Buttons/ButtonPrimaryInvert';
import { useOverlay } from 'kits/Overlay/Provider';
import { useTranslation } from 'react-i18next';
import { JoinPoolInterfaceWrapper, TitleWrapper } from './Wrappers';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { JoinForm } from './JoinForm';
import { determinePoolDisplay, remToUnit } from '@w3ux/utils';
import { Polkicon } from '@w3ux/react-polkicon';
import { useState } from 'react';
import { PageTitleTabs } from 'kits/Structure/PageTitleTabs';
import { useApi } from 'contexts/Api';
import type { PageTitleTabProps } from 'kits/Structure/PageTitleTabs/types';

export const JoinPool = () => {
  const { t } = useTranslation();

  const {
    closeCanvas,
    config: { options },
  } = useOverlay().canvas;
  const { counterForBondedPools } = useApi().poolsConfig;
  const { getBondedPool, poolsMetaData } = useBondedPools();

  // The active canvas tab.
  const [activeTab, setActiveTab] = useState(0);

  // The selected pool id. Use the provided poolId, or assign a random pool.
  const [selectedPoolId, setSelectedPoolId] = useState<number>(
    options?.poolId ||
      Math.floor(Math.random() * counterForBondedPools.minus(1).toNumber())
  );

  // Ensure bonded pool exists, and close canvas if not.
  const bondedPool = getBondedPool(selectedPoolId);

  if (!bondedPool) {
    closeCanvas();
    return null;
  }

  const metadata = poolsMetaData[selectedPoolId];

  // Generate a new pool to display.
  // TODO: Take into consideration status and recent activity.
  // TODO: Choose a random index from bondedPools.
  const handleChooseNewPool = () => {
    setSelectedPoolId(
      Math.ceil(Math.random() * counterForBondedPools.minus(1).toNumber())
    );
  };

  // Jandler to set bond as a string.
  // const handleSetBond = (newBond: { bond: BigNumber }) => {
  //   setBond({ bond: newBond.bond.toString() });
  // };

  // Tabs for the canvas.
  // TODO: Implement the Nominations tab and tab switching.
  let tabs: PageTitleTabProps[] = [
    {
      title: t('pools.overview', { ns: 'pages' }),
      active: activeTab === 0,
      onClick: () => setActiveTab(0),
    },
  ];

  tabs = tabs.concat({
    title: 'Nominations',
    active: activeTab === 1,
    onClick: () => setActiveTab(1),
  });

  return (
    <CanvasFullScreenWrapper>
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
      <JoinPoolInterfaceWrapper>
        <TitleWrapper>
          <div className="inner">
            <div>
              <Polkicon
                address={bondedPool?.addresses.stash || ''}
                size={remToUnit('4.25rem')}
                outerColor="transparent"
              />
            </div>
            <div>
              <h1>
                {determinePoolDisplay(
                  bondedPool?.addresses.stash || '',
                  metadata
                )}
              </h1>
              <div className="labels">
                <h3>Active</h3>
              </div>
            </div>
          </div>
          {tabs.length > 0 && (
            <PageTitleTabs
              sticky={false}
              tabs={tabs}
              tabClassName="canvas"
              inline={true}
            />
          )}
        </TitleWrapper>
        <div className="content">
          <div>Main content</div>
          <div>
            <JoinForm />
          </div>
        </div>
      </JoinPoolInterfaceWrapper>
    </CanvasFullScreenWrapper>
  );
};
