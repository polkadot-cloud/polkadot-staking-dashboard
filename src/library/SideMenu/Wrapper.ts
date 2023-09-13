// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';
import {
  SideMenuMaximisedWidth,
  SideMenuMinimisedWidth,
  SideMenuStickyThreshold,
} from 'consts';
import type { MinimisedProps } from './types';

export const Wrapper = styled.div<MinimisedProps>`
  border-radius: ${(props) => (props.$minimised ? '0.7rem' : 0)};
  background: none;
  padding: 1rem 1rem 1rem 1.25rem;
  overflow: auto;
  flex-grow: 1;
  margin: 0.75rem 0 3.35rem 0rem;
  display: flex;
  flex-flow: column nowrap;
  backdrop-filter: blur(4px);
  width: ${(props) =>
    props.$minimised
      ? `${SideMenuMinimisedWidth}px`
      : `${SideMenuMaximisedWidth}px`};

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: ${SideMenuStickyThreshold}px) {
    background: var(--gradient-side-menu);
    transition: all var(--transition-duration);
    border-radius: 0.75rem;
  }

  section {
    &:first-child {
      flex-grow: 1;
    }
    /* Footer */
    &:last-child {
      display: flex;
      flex-flow: ${(props) => (props.$minimised ? 'column wrap' : 'row wrap')};
      align-items: center;
      padding-top: 0.5rem;

      button {
        color: var(--text-color-secondary);
        position: relative;
        transition: color var(--transition-duration);
        margin-top: ${(props) => (props.$minimised ? '1rem' : 0)};
        margin-right: ${(props) => (props.$minimised ? 0 : '0.9rem')};
        opacity: 0.75;
        padding: 0.1rem;

        path {
          fill: var(--text-color-secondary);
        }
        &:hover {
          opacity: 1;
        }
      }
    }
  }
`;

export const LogoWrapper = styled.button<MinimisedProps>`
  display: flex;
  flex-flow: row wrap;
  justify-content: ${(props) => (props.$minimised ? 'center' : 'flex-start')};
  width: 100%;
  height: 2.8rem;
  padding: ${(props) => (props.$minimised ? '0' : '0.4rem 0.5rem')};
  margin-bottom: ${(props) => (props.$minimised ? '1.5rem' : '1rem')};
  position: relative;

  ellipse {
    fill: var(--accent-color-primary);
  }
`;

export const Separator = styled.div`
  border-bottom: 1px solid var(--border-primary-color);
  width: 100%;
  margin: 1rem 1rem 0.5rem 0;
`;

export const ConnectionSymbol = styled.div`
  width: 0.6rem;
  height: 0.6rem;
  background: ${(props) => props.color};
  border-radius: 50%;
  margin: 0 0.7rem;

  &.success {
    background: var(--status-success-color);
    color: var(--status-success-color);
  }
  &.warning {
    background: var(--status-warning-color);
    color: var(--status-warning-color);
  }
  &.danger {
    background: var(--status-danger-color);
    color: var(--status-danger-color);
  }
`;
