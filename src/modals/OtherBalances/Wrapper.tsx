// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { styled } from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  padding: 0rem 0.5rem 1rem 0.5rem;
`;

export const ItemWrapper = styled.div`
  background: var(--background-list-item);
  border-radius: 0.8rem;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  padding: 0.75rem;
  width: 100%;

  > .head {
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
`;
