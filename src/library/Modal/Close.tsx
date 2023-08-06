// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useModal } from 'contexts/Modal';
import { ReactComponent as CrossSVG } from 'img/cross.svg';
import { CloseWrapper } from './Wrappers';

export const Close = () => {
  const { setStatus } = useModal();

  return (
    <CloseWrapper>
      <button type="button" onClick={() => setStatus('closing')}>
        <CrossSVG style={{ width: '1.25rem', height: '1.25rem' }} />
      </button>
    </CloseWrapper>
  );
};
