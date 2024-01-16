// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  flex-grow: 1;

  &.no-padding {
    padding-left: 0;
  }

  .rc-slider-handle-dragging {
    box-shadow: 0 0 0 5px var(--accent-color-transparent) !important;
  }
`;
