// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { InterfaceMaximumWidth, SideMenuStickyThreshold } from 'consts';
import styled from 'styled-components';
import type { InterfaceLayoutProps, PageTitleWrapperProps } from 'types/styles';

/* PageTitleWrapper
 *
 * The element that wraps a page title. Determines the padding
 * and position relative to top of screen when the element
 * is stuck.
 */
export const PageTitleWrapper = styled.header<PageTitleWrapperProps>`
  background: var(--background-default);
  position: sticky;
  top: 0px;
  padding-top: ${(props) => (props.sticky ? '1.5rem' : '0.5rem')};
  margin-top: 4rem;
  margin-bottom: 0.25rem;
  padding-bottom: ${(props) => (props.sticky ? '0.25rem' : 0)};
  width: 100%;
  z-index: 5;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-end;
  transition: padding 0.3s ease-out;

  @media (max-width: ${SideMenuStickyThreshold}px) {
    top: 4rem;
    padding-top: 0.75rem;
    padding-bottom: 0.5rem;
  }

  .title {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    width: 100%;
    margin-bottom: ${(props) => (props.sticky ? '0.75rem ' : 0)};

    > div {
      &:last-child {
        padding-left: 1rem;
        flex-grow: 1;
      }
    }

    button {
      color: var(--text-color-secondary);
      border: 1px solid var(--border-primary-color);
      padding: 0.5rem 0.75rem;
      margin: 0;
      border-radius: 0.75rem;
      font-size: 1.1rem;

      &:hover {
        background: var(--button-secondary-background);
      }

      .icon {
        margin-left: 0.75rem;
      }
    }
  }

  h1 {
    font-size: 1.75rem;
    font-family: 'Unbounded', 'sans-serif', sans-serif;
    position: relative;
    transform: ${(props) => (props.sticky ? 'scale(0.75) ' : 'scale(1)')};
    left: ${(props) => (props.sticky ? '-1.25rem ' : 0)};

    @media (max-width: ${SideMenuStickyThreshold}px) {
      left: -1rem;
      transform: scale(0.75);
    }
    transition: all var(--transition-duration);
  }

  .tabs {
    border-bottom: ${(props) => (props.sticky ? '0px' : '1px solid')};
    border-bottom-color: var(--border-primary-color);
    overflow: hidden;
    max-width: ${InterfaceMaximumWidth}px;
    height: 3.6rem;

    margin-top: ${(props) => (props.sticky ? '0.5rem' : '0.9rem')};
    @media (max-width: ${SideMenuStickyThreshold}px) {
      margin-top: 0.5rem;
    }

    > .scroll {
      width: 100%;
      height: 4.5rem;
      overflow-x: auto;
      overflow-y: hidden;
    }

    .inner {
      display: flex;

      > button {
        color: var(--text-color-secondary);
        padding: 0.65rem 1rem;
        margin-bottom: 0.5rem;
        margin-right: 0.75rem;
        font-size: ${(props) => (props.sticky ? '1.05rem' : '1.15rem')};
        transition: opacity var(--transition-duration),
          font-size var(--transition-duration);
        border-radius: 0.5rem;

        &.active {
          background: var(--button-secondary-background);
        }
        &:last-child {
          margin-right: 0;
        }
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
`;

/* MenuPaddingWrapper
 *
 * A fixed block that is used to hide scrollable content
 * on smaller screens when a PageTitle is fixed.
 * Purely cosmetic. Applied in Pagetitle.
 */
export const MenuPaddingWrapper = styled.div`
  background: var(--background-default);
  position: fixed;
  top: 0px;
  width: 100%;
  height: 4rem;
  z-index: 4;
  display: none;
  @media (max-width: ${SideMenuStickyThreshold}px) {
    display: block;
  }
`;

/* RowPrimaryWrapper
 *
 * The primary module in a PageRow.
 */
export const RowPrimaryWrapper = styled.div<InterfaceLayoutProps>`
  order: ${(props) => props.vOrder};
  flex: 1;
  flex-basis: 100%;
  max-width: 100%;

  @media (min-width: ${(props) => props.thresholdStickyMenu + 1}px) {
    ${(props) => props.hOrder === 0 && ' padding-right: 0.75rem;'}
    ${(props) => props.hOrder === 1 && 'padding-left: 0.75rem;'}
    order: ${(props) => props.hOrder};
    flex: 1;
    flex-basis: 56%;
    width: 56%;
    max-width: ${(props) => (props.maxWidth ? props.maxWidth : 'none')};
  }

  @media (min-width: ${(props) => props.thresholdFullWidth + 400}px) {
    flex-basis: 62%;
    width: 62%;
    max-width: ${(props) => (props.maxWidth ? props.maxWidth : 'none')};
  }
`;

/* RowSecondaryWrapper
 *
 * The secondary module in a PageRow.
 */
export const RowSecondaryWrapper = styled.div<InterfaceLayoutProps>`
  order: ${(props) => props.vOrder};
  flex-basis: 100%;
  width: 100%;
  border-radius: 1rem;

  @media (min-width: ${(props) => props.thresholdStickyMenu + 1}px) {
    ${(props) => props.hOrder === 1 && ' padding-left: 0.75rem;'}
    ${(props) => props.hOrder === 0 && 'padding-right: 0.75rem;'}
    order: ${(props) => props.hOrder};
    flex: 1;
    flex-basis: 44%;
    width: 44%;
    max-width: ${(props) => (props.maxWidth ? props.maxWidth : 'none')};
  }

  @media (min-width: ${(props) => props.thresholdFullWidth + 400}px) {
    flex-basis: 38%;
    max-width: ${(props) => (props.maxWidth ? props.maxWidth : '38%')};
  }
`;

/* TopBarWrapper
 *
 * Positioned under titles for a Go Back button and other page header info.
 */
export const TopBarWrapper = styled.div`
  border-bottom: 1px solid var(--border-primary-color);
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  width: 100%;
  margin-bottom: 0.25rem;

  > span {
    margin-right: 1rem;
  }

  h3 {
    color: var(--text-color-secondary);
    font-size: 1.15rem;
    margin: 0.25rem 0;
    min-height: 2rem;
  }

  .right {
    flex: 1 1 0%;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;

    button {
      margin: 0 0 0 1rem;
    }
  }
`;

/* ButtonRowWrapper
 *
 * A flex container for a row of buttons
 */
export const ButtonRowWrapper = styled.div<{ verticalSpacing?: boolean }>`
  display: flex;
  align-items: center;
  margin-top: ${(props) => (props.verticalSpacing ? '1rem' : 0)};
`;
