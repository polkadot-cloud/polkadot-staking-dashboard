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
    padding: 0.5rem 1rem 0.5rem 1rem;
    flex: 1;

    > .inner {
      padding-left: 0.5rem;
      flex: 1;
    }
  }
`;

export const TokenWrapper = styled.div`
  border-bottom: 1px solid var(--border-primary-color);
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.85rem 0;
  margin: 0.25rem 0;
  width: 100%;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  > .token {
    margin-right: 0.75rem;
  }

  h4 {
    font-family: InterSemiBold, sans-serif;
    > .symbol {
      opacity: 0.5;
      margin-left: 0.35rem;
    }
  }
`;
