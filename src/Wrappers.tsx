// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import type { InterfaceLayoutProps } from 'types/styles';

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

/* Separator
 *
 * A horizontal spacer with a bottom border.
 * General spacer for separating content by row.
 */
export const Separator = styled.div`
  border-bottom: 1px solid var(--border-primary-color);
  width: 100%;
  margin: 0.67rem 0;
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
