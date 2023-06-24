// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SideMenuStickyThreshold } from 'consts';
import styled from 'styled-components';
import type { CardHeaderWrapperProps, CardWrapperProps } from '../Graphs/types';

/* CardHeaderWrapper
 *
 * Used as headers for individual cards. Usually a h4 accompanied
 * with a h2. withAction allows a full-width header with a right-side
 * button.
 */
export const CardHeaderWrapper = styled.div<CardHeaderWrapperProps>`
  display: flex;
  flex-flow: ${(props) => (props.$withAction ? 'row' : 'column')} wrap;
  width: 100%;
  padding: 0rem 0.25rem;

  h2 {
    font-family: InterBold, sans-serif;
  }
  h3 {
    margin-top: 0.25rem;
  }
  h2,
  h3 {
    margin-bottom: 1rem;
  }
  h2,
  h3 {
    color: var(--text-color-primary);
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    flex-grow: ${(props) => (props.$withAction ? 1 : 0)};
  }
  h3,
  h4 {
    font-family: InterSemiBold, sans-serif;
  }
  h4 {
    margin-top: 0;
    margin-bottom: 0.4rem;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    flex-grow: ${(props) => (props.$withAction ? 1 : 0)};
  }
  .note {
    color: var(--text-color-secondary);
    font-family: InterSemiBold, sans-serif;
    font-size: 1.1rem;
    margin-top: 0.2rem;
    margin-left: 0.3rem;
  }

  > div {
    display: flex;
    align-items: center;
  }
`;

/* CardWrapper
 *
 * Used to separate the main modules throughout the app.
 */
export const CardWrapper = styled.div<CardWrapperProps>`
  box-shadow: var(--card-shadow);
  background: var(--background-primary);
  border-radius: 1.1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  overflow: hidden;
  margin-top: ${(props) => (props.$transparent ? '0rem' : '1.4rem')};
  padding: ${(props) =>
    props.$noPadding ? 0 : props.$transparent ? 0 : '1.5rem'};
  ${(props) =>
    props.$transparent &&
    `
      border: none;
      box-shadow: none;
      background: none;
      border-radius: 0rem;
    `}

  @media (max-width: ${SideMenuStickyThreshold}px) {
    padding: ${(props) =>
      props.$noPadding
        ? '0rem'
        : props.$transparent
        ? '0rem 0rem'
        : '1rem 0.75rem'};
  }

  ${(props) =>
    props.$warning ? 'border: 1px solid var(--status-warning-color);' : ''}

  @media (min-width: ${SideMenuStickyThreshold + 1}px) {
    height: ${(props) => (props.$height ? `${props.$height}px` : 'inherit')};
  }

  .content {
    padding: 0 0.5rem;
    h3 {
      margin-top: 0rem;
      margin-bottom: 0.75rem;
    }

    h4 {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  .inner {
    padding: 1rem;
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    position: relative;
  }

  .option {
    border-bottom: 1px solid #ddd;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    text-align: left;
  }
  h4 {
    &.withMargin {
      margin: 0.5rem 0;
    }
  }
`;
