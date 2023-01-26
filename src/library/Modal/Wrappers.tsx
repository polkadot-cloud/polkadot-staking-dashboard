// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { borderPrimary, textPrimary, textSecondary } from 'theme';

export const TitleWrapper = styled.div<{ fixed: boolean }>`
  padding: ${(props) =>
    props.fixed ? '0.6rem 1rem 1.5rem 1rem' : '2rem 1rem 0 1rem'};
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  > div {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    padding: 0 0.5rem;

    button {
      padding: 0;
    }

    path {
      fill: ${textPrimary};
    }

    &:first-child {
      flex-grow: 1;

      > h2 {
        display: flex;
        flex-flow: row nowrap;
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
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${borderPrimary};

    > h2,
    h3,
    h4 {
      margin: 0.25rem 0;
    }
    h4 {
      margin: 0rem 0 0.75rem 0;
      display: flex;
      align-items: center;

      > .help-icon {
        margin-left: 0.5rem;
      }

      .icon {
        margin-right: 0.425rem;
      }
    }
    h2,
    h3,
    h4 {
      color: ${textSecondary};
    }
  }
`;
