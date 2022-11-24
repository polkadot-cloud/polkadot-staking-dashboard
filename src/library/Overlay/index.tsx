// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useOverlay } from 'contexts/Overlay';
import { ContentWrapper, HeightWrapper, OverlayWrapper } from './Wrappers';

export const Overlay = () => {
  const { closeOverlay, size, status, Overlay: OverlayInner } = useOverlay();

  if (status === 0) {
    return <></>;
  }

  return (
    <OverlayWrapper>
      <div>
        <HeightWrapper size={size}>
          <ContentWrapper>{OverlayInner}</ContentWrapper>
        </HeightWrapper>
        <button type="button" className="close" onClick={() => closeOverlay()}>
          &nbsp;
        </button>
      </div>
    </OverlayWrapper>
  );
};
