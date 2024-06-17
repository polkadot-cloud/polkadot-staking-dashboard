// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useOverlay } from 'kits/Overlay/Provider';
import { CanvasFullScreenWrapper } from 'canvas/Wrappers';
import { Members } from 'canvas/PoolMembers/Members';
import { useTranslation } from 'react-i18next';
import { ButtonPrimary } from 'kits/Buttons/ButtonPrimary';

export const PoolMembers = () => {
  const { t } = useTranslation();
  const { closeCanvas } = useOverlay().canvas;

  return (
    <CanvasFullScreenWrapper>
      <div className="head">
        <ButtonPrimary
          text={t('cancel', { ns: 'library' })}
          lg
          onClick={() => closeCanvas()}
          iconLeft={faTimes}
          style={{ marginLeft: '1.1rem' }}
        />
      </div>
      <h1>{t('poolMembers', { ns: 'modals' })}</h1>
      <Members />
    </CanvasFullScreenWrapper>
  );
};
