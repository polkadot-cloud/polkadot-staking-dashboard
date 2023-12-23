// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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

  .delegator {
    width: 0.75rem;
    z-index: 0;
    margin-top: 0.1rem;
    margin-right: 0.35rem;

    > div {
      width: 1.75rem;
    }
  }

  .icon {
    position: relative;
    top: 0.1rem;
    margin-right: 0.5rem;
    z-index: 1;
  }
  .title {
    font-family: InterSemiBold, sans-serif;
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
      color: var(--text-color-tertiary);
      position: absolute;
      left: 0;
      bottom: 0;
      display: inline;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      max-width: 100%;
    }
  }

  button {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    margin-left: 0.25rem;
    padding: 0;
  }

  h4 {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    flex: 1;

    > .sep {
      border-right: 1px solid var(--border-secondary-color);
      margin: 0 0.65rem 0 0.25rem;
      width: 1px;
      height: 1.25rem;
    }
    > .addr {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    > span {
      opacity: 0.7;
      margin: 0 0.5rem;
      > svg {
        margin-left: 0.5rem;
      }
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
