// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ReactComponent as CrossSVG } from 'img/cross.svg';
import { useOverlay } from 'contexts/Overlay';
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
