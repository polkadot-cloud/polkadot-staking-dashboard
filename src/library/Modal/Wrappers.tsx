// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SmallFontSizeMaxWidth } from 'consts';
import styled from 'styled-components';
import { borderPrimary, textPrimary, textSecondary } from 'theme';

export const TitleWrapper = styled.div<{ fixed: boolean }>`
  box-sizing: border-box;
  padding: ${(props) =>
    props.fixed ? '0.6rem 1rem 1.5rem 1rem' : '2rem 1.5rem 0 1.5rem'};
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
        font-family: 'Unbounded', 'sans-serif', sans-serif;
        font-size: 1.3rem;
        margin: 0;
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
  box-sizing: border-box;
  display: flex;
  flex-flow: column wrap;
  margin-bottom: 0.5rem;
  padding: 0 0.5rem;
  flex-basis: 50%;
  flex-grow: 1;

  @media (max-width: ${SmallFontSizeMaxWidth}px) {
    flex-basis: 100%;
  }

  > .inner {
    box-sizing: border-box;
    padding: 0.65rem 0;
    border-bottom: 1px solid ${borderPrimary};

    > h3,
    h4 {
      margin: 0;
    }
    h4 {
      color: ${textPrimary};
      margin: 0.6rem 0;
      display: flex;
      align-items: center;

      > .help-icon {
        margin-left: 0.55rem;
      }
    }
    h3 {
      color: ${textSecondary};
      padding-bottom: 0.15rem;
    }
  }
`;
