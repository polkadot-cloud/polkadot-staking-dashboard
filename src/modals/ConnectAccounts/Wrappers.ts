// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import { TwoThreshold } from 'library/SelectItems/Wrapper';
import styled from 'styled-components';

export const CardsWrapper = styled(motion.div)`
  width: 200%;
  display: flex;
  overflow: hidden;
  position: relative;
`;

export const ContentWrapper = styled.div`
  border-radius: 1rem;
  display: flex;
  flex-flow: column nowrap;
  width: 50%;
  height: auto;
  padding: 0 1rem 1rem 1rem;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  padding: 0;
  width: 100%;
  overflow: hidden;

  h1 {
    color: var(--text-color-primary);
    font-size: 1.4rem;
    font-family: 'Unbounded', 'sans-serif', sans-serif;
    padding: 0.5rem 0.5rem 0 0.5rem;
  }

  h3 {
    color: var(--text-color-primary);

    &.heading {
      border-bottom: 1px solid var(--border-primary-color);
      padding-bottom: 0.75rem;
      margin: 2rem 0 1rem 0;
    }
  }

  .head {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin: 0.5rem 0 1.5rem 0;

    h1 {
      display: flex;
      align-items: center;
      > button {
        margin-left: 1.25rem;
      }
    }
  }
`;

export const PaddingWrapper = styled.div`
  padding: 1rem 0 0.5rem 0rem;
  height: auto;
`;

export const AccountGroupWrapper = styled(motion.button)`
  background: var(--button-primary-background);
  border-radius: 1rem;
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  transition: background 0.15s;

  > h5 {
    margin: 0 0 0.25rem 0;
    opacity: 0.75;
  }
  > div {
    margin: 0.4rem 0;
    > button,
    > div {
      border: 1px solid var(--background-modal);
      border-radius: 0.75rem;
      margin: 0;
    }
  }
`;

export const AccountWrapper = styled.div`
  width: 100%;
  margin: 0.5rem 0;
  transition: transform 0.1s;

  &:hover {
    transform: scale(1.006);
    .name {
      color: var(--network-color-primary);
    }
  }

  > div,
  button {
    background: var(--button-primary-background);
    color: var(--text-color-primary);
    width: 100%;
    border-radius: 0.75rem;
    font-size: 1rem;
    display: flex;
    align-items: center;
    min-height: 3.5rem;
    padding-left: 0.4rem;
    padding-right: 0.4rem;

    > div {
      display: flex;
      align-items: center;
      padding: 0 0.25rem;

      &:first-child {
        flex-shrink: 1;
        overflow: hidden;
        .name {
          max-width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          transition: color 0.15s;
        }
      }

      &:last-child {
        flex-grow: 1;
        justify-content: flex-end;
      }

      &.neutral {
        h5 {
          color: var(--text-color-secondary);
          opacity: 0.75;
        }
      }
      &.danger {
        h5 {
          color: var(--status-danger-color);
        }
      }
      .icon {
        width: 1.05rem;
        height: 1.05rem;
        margin-left: 0.75rem;
      }

      /* svg theming */
      svg {
        .light {
          fill: var(--text-color-invert);
        }
        .dark {
          fill: var(--text-color-secondary);
        }
      }
    }
  }
`;

export const ExtensionsWrapper = styled.div`
  width: 100%;
  padding: 0 0.5rem;

  @media (max-width: ${TwoThreshold}px) {
    padding: 0;
  }
`;
export const ExtensionItem = styled.div`
  padding: 0.75rem;
  flex-grow: 0;
  width: 50%;

  @media (max-width: ${TwoThreshold}px) {
    width: 100%;
  }

  > .inner {
    background: var(--button-primary-background);
    width: 100%;
    border-radius: 1rem;
    overflow: hidden;
    position: relative;
    transition: transform 0.15s;

    &:hover {
      transform: scale(1.02);
    }
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
      padding: 1.35rem 0.75rem 0.75rem 0.75rem;
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
      padding: 0.75rem 0.75rem;

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
  border-top: 1px solid var(--text-color-secondary);
  width: 100%;
  opacity: 0.1;
  margin: 1.5rem 0rem;
`;
