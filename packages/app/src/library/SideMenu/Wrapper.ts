// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  PageWidthMediumThreshold,
  SideMenuMaximisedWidth,
  SideMenuMinimisedWidth,
} from 'consts'
import styled from 'styled-components'
import type { MinimisedProps } from './types'

export const Wrapper = styled.div<MinimisedProps>`
  border-radius: ${(props) => (props.$minimised ? '0.7rem' : 0)};
  background: none;
  padding: 0.5rem 1rem 0.5rem 1.25rem;
  overflow: auto;
  flex-grow: 1;
  display: flex;
  flex-flow: column nowrap;
  backdrop-filter: blur(4px);
  width: ${(props) =>
    props.$minimised
      ? `${SideMenuMinimisedWidth}px`
      : `${SideMenuMaximisedWidth}px`};
  padding: ${(props) =>
    props.$minimised ? `0.5rem 1rem 0.5rem 1rem` : `0rem 1rem 1rem 1rem`};
  margin: 0.75rem 0;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: ${PageWidthMediumThreshold}px) {
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
      padding-left: ${(props) => (props.$minimised ? 0 : '0.25rem')};

      button {
        color: var(--text-color-secondary);
        position: relative;
        transition: color var(--transition-duration);
        margin-top: ${(props) => (props.$minimised ? '1rem' : 0)};
        margin-right: ${(props) => (props.$minimised ? 0 : '1.25rem')};
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

    > .inner {
      padding-left: ${(props) => (props.$minimised ? '0.1rem' : '0.25rem')};
    }
  }
`

export const LogoWrapper = styled.button<MinimisedProps>`
  display: flex;
  flex-flow: row wrap;
  justify-content: ${(props) => (props.$minimised ? 'center' : 'flex-start')};
  align-items: center;
  width: 100%;
  height: 2.8rem;
  padding: ${(props) => (props.$minimised ? '0' : '0.4rem 0 0.4rem 0.5rem')};
  margin-top: ${(props) => (props.$minimised ? '0' : '0.6rem')};
  margin-bottom: ${(props) => (props.$minimised ? '0.75rem' : '0.5rem')};
  position: relative;
  text-transform: uppercase;

  > .toggle {
    position: absolute;
    top: ${(props) => (props.$minimised ? '0.9rem' : '-0.1rem')};
    right: ${(props) => (props.$minimised ? '-0.65rem' : '0')};
    height: 100%;
    display: flex;
    align-items: center;

    > .label {
      background: var(--background-primary);
      color: var(--text-color-secondary);
      width: 1.75rem;
      height: 1.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
  }
  > span {
    margin-top: 0.25rem;
    margin-left: 0.75rem;
    background-clip: text;
    display: flex;
    align-items: center;

    .logo {
      width: auto;
      height: ${(props) => (props.$minimised ? '2.15rem' : '1.5rem')};
    }
  }

  &:hover {
    > .toggle > .label {
      color: var(--accent-color-primary);
    }
  }
`

export const Separator = styled.div`
  border-bottom: 1px solid var(--border-primary-color);
  width: 100%;
  margin: 1rem 1rem 0.5rem 0;
`

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
`
