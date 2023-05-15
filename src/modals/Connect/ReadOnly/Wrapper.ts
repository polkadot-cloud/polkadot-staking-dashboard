// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Wrapper = styled.div`
  color: var(--text-color-primary);
  width: 100%;
  display: flex;
  flex-flow: column nowrap;

  h3 {
    display: flex;
    align-items: center;
    > span {
      margin-left: 1rem;
    }
  }
  h4 {
    margin: 0.25rem 0 0 0;
  }

  > .content {
    width: 100%;
    > h5 {
      margin-top: 1rem;
    }
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
      transition: opacity var(--transition-duration);

      &:first-child {
        flex: 1;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        h4 {
          margin: 0;
        }

        > span {
          margin-right: 0.75rem;
        }
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

export const ActionWithButton = styled.div`
  border-bottom: 1px solid var(--border-primary-color);
  width: 100%;
  color: var(--text-color-primary);
  display: flex;
  align-items: center;
  margin: 1.25rem 0 0;
  padding-bottom: 0.75rem;

  > div {
    &:first-child {
      display: flex;
      align-items: center;
      flex-grow: 1;
      font-variation-settings: 'wght' 650;
      > svg {
        margin-right: 0.5rem;
      }
    }
    &:last-child {
      font-variation-settings: 'wght' 650;
    }
  }
`;
