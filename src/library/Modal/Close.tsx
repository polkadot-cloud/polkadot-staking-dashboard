// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import CrossSVG from 'img/cross.svg?react';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { CloseWrapper } from './Wrappers';

export const Close = () => {
  const { setModalStatus } = useOverlay().modal;

  return (
    <CloseWrapper>
      <button type="button" onClick={() => setModalStatus('closing')}>
        <CrossSVG style={{ width: '1.25rem', height: '1.25rem' }} />
      </button>
    </CloseWrapper>
  );
};
