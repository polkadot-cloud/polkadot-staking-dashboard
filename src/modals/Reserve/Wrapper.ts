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
    margin-top: 1rem;
    height: 25px;
    background: var(--border-secondary-color);
    border-radius: 1.5rem;
    opacity: 0.5;
    transition: 0.2s;
    transition: opacity 0.2s;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
    :disabled {
      opacity: 0.5;
    }

    &::-webkit-slider-thumb {
      appearance: none;
      width: 23px;
      height: 24px;
      border-radius: 1.25rem;
      background: var(--network-color-primary);
      cursor: pointer;
    }
    &::-moz-range-thumb {
      width: 23px;
      height: 24px;
      border-radius: 1.25rem;
      background: var(--network-color-primary);
      cursor: pointer;
    }
  }
`;

export const ConfirmButton = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-items: flex-end;
`;
