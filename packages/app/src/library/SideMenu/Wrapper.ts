// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  PageWidthMediumThreshold,
  SideMenuHiddenWidth,
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

  @media (max-width: ${PageWidthMediumThreshold}px) {
    width: ${SideMenuHiddenWidth}px;
  }

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
        margin-right: ${(props) => (props.$minimised ? 0 : '1rem')};
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
    right: ${(props) => (props.$minimised ? '-0.25rem' : '0')};
    height: 100%;
    display: flex;
    align-items: center;

    > .label {
      background: var(--background-primary);
      color: var(--text-color-secondary);
      width: 1.5rem;
      height: 1.5rem;
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

export const BulletWrapper = styled.div`
  color: var(--status-success-color);
  display: flex;
  flex: 1;
  font-size: 0.88rem;
  flex-flow: row wrap;
  justify-content: flex-end;
  margin-right: 0.4rem;
  opacity: 0.7;

  > span {
    &.success {
      color: var(--accent-color-primary);
      border: 1px solid var(--accent-color-primary);
    }
    &.warning {
      color: var(--accent-color-secondary);
      border: 1px solid var(--accent-color-secondary);
    }
    border-radius: 0.5rem;
    padding: 0.15rem 0.5rem;
  }

  &.success {
    svg {
      color: var(--status-success-color);
    }
  }
  &.warning {
    svg {
      color: var(--accent-color-secondary);
    }
  }
  &.accent {
    svg {
      color: var(--accent-color-primary);
    }
  }
  &.danger {
    svg {
      color: var(--status-danger-color);
    }
  }
  &.minimised {
    > svg {
      flex: 0;
      position: absolute;
      right: -3px;
      top: -4px;
    }
  }
`
