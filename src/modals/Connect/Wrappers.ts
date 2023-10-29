// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';
import { TwoThreshold } from 'library/SelectItems/Wrapper';

// Wraps a list of extensions. `SelectItems` typically follows this wrapper, with the items embedded
// within it.
export const ExtensionsWrapper = styled.div`
  width: 100%;
  padding: 0 0.4rem;
  margin: 0.5rem 0 1rem 0;

  @media (max-width: ${TwoThreshold}px) {
    padding: 0;
  }
`;

// Styling for an extension item, which can reflect the status of the extension connection.
export const ExtensionInner = styled.div`
  background: var(--button-primary-background);
  width: 100%;
  border-radius: 1rem;
  overflow: hidden;
  position: relative;

  h3 {
    font-family: InterSemiBold, sans-serif;
    margin: 1rem 0 0 0;
    > svg {
      margin-right: 0.5rem;
    }
  }
  p {
    color: var(--text-color-secondary);
    padding: 0;
    margin: 0;
    .plus {
      margin-right: 0.4rem;
    }
  }
  .body {
    width: 100%;
    padding: 1.35rem 0.85rem 0.75rem 0.85rem;
    position: relative;

    .button {
      z-index: 1;
      position: absolute;
      background: none;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      &:disabled {
        cursor: default;
      }
    }
  }
  .row {
    width: 100%;
    display: flex;
  }
  .foot {
    padding: 0.25rem 1rem 1rem 1rem;
  }
  .status {
    position: absolute;
    top: 0.9rem;
    right: 0.9rem;
    .success {
      color: var(--status-success-color);
    }
    .active {
      color: var(--accent-color-primary);
    }
  }
  .icon {
    color: var(--text-color-primary);
    width: 100%;

    svg {
      max-width: 2.6rem;
      max-height: 2.6rem;
    }
  }
  svg {
    .light {
      fill: var(--text-color-invert);
    }
    .dark {
      fill: var(--text-color-secondary);
    }
  }
`;

// Styling for a separator between ExtensionItems.
export const Separator = styled.div`
  width: 100%;
  height: 0.25rem;
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
      font-family: InterSemiBold, sans-serif;
      > svg {
        margin-right: 0.5rem;
      }
    }
    &:last-child {
      font-family: InterSemiBold, sans-serif;
    }
  }
`;

export const ManualAccountsWrapper = styled.div`
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
`;

export const ManualAccount = styled.div`
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
      align-items: center;

      > span {
        margin-right: 0.75rem;
      }

      > .text {
        display: flex;
        flex-direction: column;
        h4 {
          margin: 0;
          &.title {
            font-family: InterSemiBold, sans-serif;
            > svg {
              margin: 0 0.6rem;
            }
          }
          &.subtitle {
            margin-top: 0.4rem;
          }

          &.title > span,
          &.subtitle > span {
            color: var(--text-color-secondary);
            opacity: 0.65;
            margin-right: 0.65rem;
          }
          .arrow {
            margin: 0 0.25rem;
          }
        }
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
`;
