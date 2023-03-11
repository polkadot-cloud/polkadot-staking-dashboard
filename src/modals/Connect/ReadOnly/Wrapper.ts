// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Wrapper = styled.div`
  color: var(--text-color-primary);
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  margin-bottom: 1.5rem;

  h3 {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    > span {
      margin-left: 1rem;
    }
  }
  h4 {
    margin: 0.25rem 0 0 0;
  }

  > .content {
    width: 100%;
  }

  .accounts {
    margin-top: 1rem;
    width: 100%;
  }

  .account {
    background: var(--button-primary-background);
    width: 100%;
    border-radius: 1rem;
    margin-bottom: 1rem;
    padding: 1rem;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    transition: border 0.1s;

    > div {
      color: var(--text-color-secondary);
      transition: opacity 0.2s;

      &:first-child {
        flex: 1;
        display: flex;
        flex-flow: row wrap;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &:last-child {
        padding-left: 2rem;
        opacity: 0.25;
      }
    }

    button {
      font-size: 1rem;
    }
  }
`;
