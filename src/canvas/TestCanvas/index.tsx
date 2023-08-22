// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonHelp } from '@polkadot-cloud/react';
import { useHelp } from 'contexts/Help';
import { useOverlay } from 'contexts/Overlay';
import { CanvasCardWrapper } from 'library/Canvas/Wrappers';

export const TestCanvas = () => {
  const { closeCanvas } = useOverlay().canvas;
  const { openHelp } = useHelp();

  return (
    <CanvasCardWrapper>
      <h1>Test</h1>
      <button type="button" onClick={() => closeCanvas()}>
        Close
      </button>
      <ButtonHelp
        onClick={() => openHelp('Reserve Balance For Existential Deposit')}
        style={{ marginLeft: '0.65rem' }}
      />
    </CanvasCardWrapper>
  );
};
