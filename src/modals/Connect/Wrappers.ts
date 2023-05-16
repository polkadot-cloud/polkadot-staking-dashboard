// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TwoThreshold } from 'library/SelectItems/Wrapper';
import styled from 'styled-components';

// Wraps a list of extensions. `SelectItems` typically follows this wrapper, with the items embedded
// within it.
export const ExtensionsWrapper = styled.div`
  width: 100%;
  padding: 0 0.4rem;
  margin: 0.5rem 0;

  @media (max-width: ${TwoThreshold}px) {
    padding: 0;
  }
`;
export const ConnectItem = styled.div`
  padding: 0.5rem;
  flex-grow: 0;
  width: 50%;

  @media (max-width: ${TwoThreshold}px) {
    width: 100%;
  }

  &.canConnect {
    > .inner {
      transition: transform var(--transition-duration);
      &:hover {
        transform: scale(1.015);
      }
    }
  }
`;

// Styling for a hardware item, which can reflect the status of the hardware connection.
export const HardwareInner = styled.div`
  background: var(--button-primary-background);
  width: 100%;
  border-radius: 1rem;
  overflow: hidden;
  position: relative;

  .body {
    width: 100%;
    padding: 1.35rem 0.85rem 0.75rem 0.85rem;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .row {
      width: 100%;
      display: flex;
      justify-content: center;

      p {
        margin-bottom: 0;
      }

      &.margin {
        margin-top: 0.75rem;
      }
      .logo {
        height: 3rem;
        margin: 0.5rem;

        &.ledger {
          path {
            fill: var(--text-color-secondary);
          }
        }
      }
    }
    .status {
      position: absolute;
      top: 0.9rem;
      right: 0.9rem;
    }
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
    margin: 1rem 0 0 0;
    font-variation-settings: 'wght' 600;
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
  .status {
    position: absolute;
    top: 0.9rem;
    right: 0.9rem;
    .success {
      color: var(--status-success-color);
    }
    .active {
      color: var(--network-color-primary);
    }
  }
  .icon {
    width: 2.6rem;
    height: 2.6rem;
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

// Footer for a connect item, that holds a URL to the item's webpage.
export const ConnectItemFoot = styled.div`
  border-top: 1px solid var(--border-primary-color);
  width: 100%;
  padding: 0.85rem 0.85rem;

  a {
    color: var(--text-color-secondary);
    transition: color var(--transition-duration);
    display: flex;
    align-items: center;
    font-size: 0.92rem;
    &:hover {
      color: var(--network-color-primary);
    }
    > svg {
      margin-left: 0.3rem;
      margin-top: 0.1rem;
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

export const ManualAccountBasic = styled.div`
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
            font-variation-settings: 'wght' 600;
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
