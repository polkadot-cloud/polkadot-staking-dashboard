// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TwoThreshold } from 'library/SelectItems/Wrapper';
import styled from 'styled-components';

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
      transition: transform 0.15s;
      &:hover {
        transform: scale(1.015);
      }
    }
  }

  > .inner {
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
    h5 {
      margin: 0;
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
    .foot {
      border-top: 1px solid var(--border-primary-color);
      width: 100%;
      padding: 0.85rem 0.85rem;

      a {
        color: var(--text-secondary-color);
        transition: color 0.15s;
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
  }
`;

export const Separator = styled.div`
  width: 100%;
  height: 0.25rem;
`;
