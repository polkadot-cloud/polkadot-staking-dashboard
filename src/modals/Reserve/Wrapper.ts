// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const SliderWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  width: 100%;

  .slider {
    appearance: none;
    width: 100%;
    marigin: 1.5rem;
    height: 25px;
    background: var(--network-color-primary);
    border-radius: 1.5rem;
    opacity: 0.5;
    transition: 1s;
    transition: opacity 1s;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }
`;
