// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { styled } from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  padding: 0rem 0.5rem 1rem 0.5rem;
`;

export const ItemWrapper = styled.div`
  background: var(--button-primary-background);
  border-radius: 0.8rem;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  width: 100%;

  > .head {
    background: var(--button-tertiary-background);
    border-bottom: 1px solid var(--border-primary-color);
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    width: 100%;

    > .icon {
      width: 3rem;
      height: 3rem;
      margin-right: 1rem;
    }

    > h3 {
      font-family: InterBold, sans-serif;
      margin: 0;
    }
    > p {
      margin: 0 0 0 0.5rem;
      > button {
        cursor: default;
      }
    }
  }

  .assets {
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    display: flex;
    padding: 1rem 1rem 1rem 1rem;

    > .inner {
      padding-left: 1rem;
      border-left: 1px solid var(--border-secondary-color);
    }
  }
`;

export const TokenWrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 0.25rem 0;
`;
