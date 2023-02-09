// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
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

    > div:last-child {
      display: flex;
      flex-flow: row-reverse wrap;
      flex-grow: 1;

      button {
        background: none;
        opacity: 0.85;
      }
    }
  }
`;

export const PaddingWrapper = styled.div`
  padding: 1rem 0 0.5rem 0rem;
  height: auto;
`;

export const AccountGroupWrapper = styled(motion.button)`
  border-radius: 1rem;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  background: var(--button-primary-background);
  margin-bottom: 1rem;
  transition: background 0.15s;

  > section {
    display: flex;
    flex-flow: row wrap;
    flex-basis: 100%;

    @media (min-width: 800px) {
      flex-basis: 50%;

      &:first-child {
        padding-right: 0.25rem;
      }
      &:last-child {
        padding-left: 0.25rem;
      }
    }

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
  }

  &:hover {
    background: var(--button-toggle-background);
    > section > div {
      > button,
      > div {
        background: var(--button-toggle-background);
      }
    }
  }
`;

export const AccountWrapper = styled.div`
  width: 100%;
  margin: 0.5rem 0;

  > button {
    &:hover {
      background: var(--button-toggle-background);
    }
    &:disabled {
      cursor: default;
      border: 2px solid rgba(242, 185, 27, 0.25);
    }
  }

  > div,
  button {
    color: var(--text-color-primary);
    width: 100%;
    border-radius: 0.75rem;
    font-size: 1rem;
    background: var(--button-primary-background);
    transition: background 0.15s;
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

export const ExtensionWrapper = styled.div<{ noSpacing?: boolean }>`
  width: 100%;

  > button,
  > div {
    margin: ${(props) => (props.noSpacing ? 0 : '1rem 0')};
    padding: ${(props) => (props.noSpacing ? 0 : '1rem 0.25rem')};
    color: var(--text-color-primary);
    width: 100%;
    font-size: 1rem;
    background: var(--button-primary-background);
    border-radius: 0.75rem;
    transition: background 0.15s;
    display: flex;
    align-items: center;
    min-height: 3.5rem;

    > div {
      display: flex;
      align-items: center;
      padding: 0 1rem;
      h3,
      h4 {
        margin: 0;
        padding: 0;
      }
      span {
        margin-right: 1.25rem;
        &.name {
          max-width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        &.message {
          opacity: 0.75;
        }
      }
      &:first-child {
        flex-shrink: 1;
        overflow: hidden;
      }
      &:last-child {
        flex-grow: 1;
        justify-content: flex-end;
        .icon {
          margin-left: 1rem;
        }
      }
    }
    .neutral {
      color: var(--text-color-secondary);
    }
    .danger {
      color: var(--status-danger-color);
    }
    .success {
      color: var(--status-success-color);
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
  > button {
    padding: 0 0.2rem;
    &:hover {
      background: var(--button-toggle-background);
    }

    &:disabled {
      cursor: default;
      opacity: 1;
      &:hover {
        background: var(--button-primary-background);
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
