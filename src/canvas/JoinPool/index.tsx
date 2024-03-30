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

export const JoinPool = () => {
  const { t } = useTranslation();

  const {
    closeCanvas,
    config: { options },
  } = useOverlay().canvas;
  const { bondedPools, getBondedPool, poolsMetaData } = useBondedPools();

  // The selected pool id. Use the provided poolId, or assign a random pool.
  const [selectedPoolId] = useState<number>(
    options?.poolId || Math.floor(Math.random() * bondedPools.length - 1)
  );
  const bondedPool = getBondedPool(selectedPoolId);
  const metadata = poolsMetaData[selectedPoolId];

  // Jandler to set bond as a string.
  // const handleSetBond = (newBond: { bond: BigNumber }) => {
  //   setBond({ bond: newBond.bond.toString() });
  // };

  return (
    <CanvasFullScreenWrapper>
      <div className="head">
        <ButtonPrimaryInvert
          text={'Choose Another Pool'}
          iconLeft={faArrowsRotate}
          onClick={() => {
            /* TODO: implement */
          }}
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
                size={remToUnit('4rem')}
              />
            </div>
            <div>
              <h1>
                {determinePoolDisplay(
                  bondedPool?.addresses.stash || '',
                  metadata
                )}
              </h1>
            </div>
          </div>
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
