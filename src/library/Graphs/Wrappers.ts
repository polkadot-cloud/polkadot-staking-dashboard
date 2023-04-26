// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SectionFullWidthThreshold, SideMenuStickyThreshold } from 'consts';
import styled from 'styled-components';
import type {
  CardHeaderWrapperProps,
  CardWrapperProps,
  GraphWrapperProps,
} from './types';

/* CardHeaderWrapper
 *
 * Used as headers for individual cards. Usually a h4 accompanied
 * with a h2. withAction allows a full-width header with a right-side
 * button.
 */
export const CardHeaderWrapper = styled.div<CardHeaderWrapperProps>`
  display: flex;
  flex-flow: ${(props) => (props.withAction ? 'row' : 'column')} wrap;
  width: 100%;
  padding: ${(props) => (props.padded ? '0.5rem 1.2rem' : '0.25rem')};

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
    flex-grow: ${(props) => (props.withAction ? 1 : 0)};
  }
  h4 {
    margin-top: 0;
    margin-bottom: 0.6rem;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    flex-grow: ${(props) => (props.withAction ? 1 : 0)};
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
  box-shadow: var(--card-shadow) var(--card-shadow-color);
  background: var(--background-primary);
  padding: ${(props) =>
    props.noPadding ? '0rem' : props.transparent ? '0rem 0rem' : '1.2rem'};
  border-radius: 1.1rem;
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
  width: 100%;
  margin-top: ${(props) => (props.transparent ? '0rem' : '1.4rem')};
  position: relative;
  ${(props) =>
    props.transparent &&
    `
    border: none;
    box-shadow: none;
    background: none;
  `}

  ${(props) =>
    props.warning ? 'border: 1px solid var(--status-warning-color);' : ''}

  @media (max-width: ${SideMenuStickyThreshold}px) {
    padding: ${(props) =>
      props.noPadding
        ? '0rem'
        : props.transparent
        ? '0rem 0rem'
        : '1rem 0.75rem'};
  }

  @media (min-width: ${SideMenuStickyThreshold + 1}px) {
    height: ${(props) => (props.height ? `${props.height}px` : 'inherit')};
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
`;

/* GraphWrapper
 *
 * Acts as a module, but used to wrap graphs.
 */

export const GraphWrapper = styled.div<GraphWrapperProps>`
  box-shadow: var(--card-shadow) var(--card-shadow-color);
  background: ${(props) =>
    props.transparent ? 'none' : 'var(--background-primary)'};
  border-radius: 1rem;
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
  position: relative;
  overflow: hidden;
  margin-top: ${(props) => (props.noMargin ? 0 : '1.4rem')};
  ${(props) =>
    props.transparent &&
    `
    border: none;
    box-shadow: none;
    background: none;
  `}
  ${(props) =>
    props.minHeight &&
    `
    @media(min-width: ${SectionFullWidthThreshold + 1}px) {
      min-height: ${props.minHeight}px;
    }
  `}

  .inner {
    width: 100%;
    height: 100%;
  }

  .label {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 0.8rem;
    background: var(--network-color-primary);
    border-radius: 0.3rem;
    padding: 0.2rem 0.4rem;
    color: #fff;
    opacity: 0.8;
  }
  .head {
    padding: 0.5rem 1.2rem;
  }

  h2 {
    margin-bottom: 1rem;

    .amount {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  h2,
  h4 {
    margin: 0;
    padding: 0.25rem 0 0.5rem 0;
    display: flex;
    flex-flow: row wrap;
    align-content: flex-end;
    align-items: flex-end;

    .fiat {
      color: var(--text-color-secondary);
      font-size: 1.1rem;
      margin-top: 0.2rem;
      margin-left: 0.3rem;
    }
  }
  h2 {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }
  p {
    margin: 0.25rem 0 0;
  }
  h4 {
    align-items: center;
    margin-top: 0.4rem;
  }

  h5 {
    &.secondary {
      color: var(--text-color-secondary);
      opacity: 0.7;
      margin-top: 1.5rem;
    }
  }
  .small_button {
    background: #f1f1f1;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
  }
  .graph {
    position: relative;
    flex: ${(props) => (props.flex ? 1 : 0)};
    flex-flow: row wrap;
    justify-content: center;
    width: 100%;
    padding: 1rem 1.75rem;
  }
  .graph_line {
    margin-top: 0.6rem;
    padding: 0rem 0rem 0.5rem 1.5rem;
  }
  .graph_with_extra {
    width: 100%;
    display: flex;
    height: 190px;
    flex: 1;

    .extra {
      flex: 1;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-end;
      align-items: flex-end;
      align-content: flex-end;
      height: 190px;
      border: 1px solid;
    }
  }

  .change {
    margin-left: 0.6rem;
    font-size: 0.9rem;
    color: var(--text-color-primary);
    border-radius: 0.75rem;
    padding: 0.15rem 0.5rem;
    &.pos {
      background: #3eb955;
    }
    &.neg {
      background: #d2545d;
    }
  }
`;
