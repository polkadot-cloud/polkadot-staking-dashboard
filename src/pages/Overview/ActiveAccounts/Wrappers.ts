// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const ActiveAccounsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  > div {
    border-bottom: 1px solid var(--border-primary-color);
    padding: 0.65rem 0;

    &:last-child {
      border: none;
      padding-bottom: 0;
    }
  }
`;

export const ItemWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  overflow: hidden;
  width: 100%;

  .icon {
    position: relative;
    top: 0.1rem;
    margin-right: 0.5rem;
  }
  .title {
    margin: 0;
    padding: 0;
    flex: 1;
    overflow: hidden;

    &.signer {
      padding-left: 2rem;
    }
  }
  .rest {
    flex: 1 1 0%;
    min-height: 1.8rem;
    overflow: hidden;
    position: relative;

    .name {
      position: absolute;
      left: 0;
      bottom: -0.15rem;
      max-width: 100%;
      display: inline;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      opacity: 0.75;
    }
  }

  button {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    margin-left: 0.75rem;
    padding: 0;
  }

  h4 {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    flex: 1;

    > .sep {
      border-right: 1px solid var(--border-secondary-color);
      margin: 0 0.8rem;
      width: 1px;
      height: 1.25rem;
    }
    > .addr {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  > *:last-child {
    flex-grow: 1;
    display: flex;
    flex-flow: row-reverse wrap;

    .copy {
      color: var(--text-color-secondary);
      opacity: 0.9;
      cursor: pointer;
      transition: opacity var(--transition-duration);
      &:hover {
        opacity: 1;
      }
    }
  }
`;
