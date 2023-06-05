// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const ReserveWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 2rem;
  div {
    display: flex;
    .current {
      width: 3rem;
    }
    .slider {
      padding: 0 1.25rem;
      flex-grow: 1;
      .rc-slider-handle-dragging {
        box-shadow: 0 0 0 5px var(--network-color-transparent) !important;
      }
    }
  }
  .confirm {
    display: flex;
    flex-flow: column wrap;
    align-items: flex-end;
    margin-top: 2.5rem;
  }
`;
