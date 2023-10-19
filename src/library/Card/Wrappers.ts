// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';
import { SideMenuStickyThreshold } from 'consts';
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
  align-items: ${(props) => (props.$withAction ? 'center' : 'none')};
  justify-content: ${(props) => (props.$withAction ? 'none' : 'center')};
  margin-bottom: ${(props) => (props.$withMargin ? '1rem' : 0)};
  padding: 0rem 0.25rem;
  width: 100%;

  h2 {
    font-family: InterBold, sans-serif;
    margin-bottom: 1rem;
  }
  h2,
  h3 {
    color: var(--text-color-primary);
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    flex-grow: ${(props) => (props.$withAction ? 1 : 0)};

    @media (max-width: ${SideMenuStickyThreshold}px) {
      margin-top: 0.5rem;
    }
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
    margin-left: 0.4rem;
  }
  .networkIcon {
    width: 1.9rem;
    height: 1.9rem;
    margin-right: 0.55rem;
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
  margin-top: 1.4rem;
  padding: 1.5rem;

  &.transparent {
    background: none;
    border: none;
    border-radius: 0;
    box-shadow: none;
    margin-top: 0;
    padding: 0;
  }

  &.warning {
    border: 1px solid var(--status-warning-color);
  }

  @media (max-width: ${SideMenuStickyThreshold}px) {
    padding: 1rem 0.75rem;
  }

  @media (min-width: ${SideMenuStickyThreshold + 1}px) {
    height: ${(props) => (props.height ? `${props.height}px` : 'inherit')};
  }

  .inner {
    padding: 1rem;
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    position: relative;
  }

  .content {
    padding: 0 0.5rem;

    h3,
    h4 {
      margin-top: 0;
    }
    h3 {
      margin-bottom: 0.75rem;
    }

    h4 {
      margin-bottom: 0;
    }
  }
`;
