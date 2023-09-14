// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const TitleWrapper = styled.div<{ $fixed: boolean }>`
  padding: ${(props) =>
    props.$fixed ? '0.6rem 1rem 0rem 1rem' : '2rem 1rem 0 1rem'};
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  width: 100%;
  min-height: 3rem;

  > div {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    padding: 0 0.5rem;

    button {
      padding: 0;
    }

    path {
      fill: var(--text-color-primary);
    }

    &:first-child {
      flex-grow: 1;

      > h2 {
        display: flex;
        align-items: center;
        font-family: 'Unbounded', 'sans-serif', sans-serif;
        font-size: 1.3rem;
        margin: 0;

        > button {
          margin-left: 0.85rem;
        }
      }
      > svg {
        margin-right: 0.9rem;
      }
    }

    &:last-child {
      button {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        opacity: 0.25;
        &:hover {
          opacity: 1;
        }
      }
    }
  }
`;

export const StatsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  margin-top: 1rem;
`;
export const StatWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  margin-bottom: 1rem;
  padding: 0 0.75rem;
  flex-grow: 1;
  flex-basis: 100%;

  @media (min-width: 600px) {
    margin-bottom: 0.5rem;
  }

  @media (min-width: 601px) {
    flex-basis: 33%;
  }

  > .inner {
    border-bottom: 1px solid var(--border-primary-color);
    padding-bottom: 0.5rem;

    > h2,
    h3,
    h4 {
      margin: 0.25rem 0;
    }
    h4 {
      margin: 0rem 0 0.75rem 0;
      display: flex;
      align-items: center;

      .icon {
        margin-right: 0.425rem;
      }
    }
    h2,
    h3,
    h4 {
      color: var(--text-color-secondary);
    }
  }
`;

export const CloseWrapper = styled.div`
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  z-index: 2;

  > button {
    opacity: 0.4;
    transition: opacity var(--transition-duration) ease-in-out;

    &:hover {
      opacity: 1;
    }
  }
`;
