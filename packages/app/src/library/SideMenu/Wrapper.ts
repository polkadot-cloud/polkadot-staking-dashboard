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

  padding: 0 1rem 1rem 0;
  padding-left: ${(props) => (props.$minimised ? '1rem' : '0')};
  margin: 0;

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
    > .inner {
      padding-left: ${(props) => (props.$advancedMode ? '0' : props.$minimised ? '0.1rem' : '0.25rem')};
    }
  }
`

export const LogoWrapper = styled.button<MinimisedProps>`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 4rem;
  padding: 0 0 0.4rem 0;
  position: relative;
  text-transform: uppercase;
  margin-left: ${(props) => (props.$minimised ? '0.2rem' : '0.75rem')};

  > img, > svg  {  
    margin-left: ${(props) => (props.$minimised ? '0.8rem' : '0')};
    width: ${(props) => (props.$minimised ? '2.25rem' : '1.75em')};
    height: ${(props) => (props.$minimised ? '2.25rem' : '1.75rem')};
  }
  > span {
    margin-top: 0.25rem;
    margin-left: 0.75rem;
    background-clip: text;
    display: flex;
    align-items: center;

    .logo {
      width: auto;
      height: 1.45rem;
    }
  }

  &:hover {
    > .toggle > .label {
      color: var(--accent-color-primary);
    }
  }
`

export const ToggleWrapper = styled.button`
  position: absolute;
  top: 1.05rem;
  width: 1.7rem;
  height: 1.7rem;
  right: -0.75rem;
  display: flex;
  align-items: center;
  z-index: 10;

  @media(max-width: ${PageWidthMediumThreshold}px) {
    display: none;
  }

  > .label {
    background: var(--background-primary);
    color: var(--text-color-secondary);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid var(--border-primary-color);
  }
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

  &.accent {
    svg {
      color: var(--accent-color-primary);
    }
  }
  &.success {
    svg {
      color: var(--status-success-color);
    }
  }
  &.warning {
    svg {
      color: var(--status-warning-color);
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

export const BarLogoWrapper = styled.div`
  width: calc(100% - 2rem);
  display: flex;
  justify-content: center;
  margin: 0.75rem auto 0 auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  height: 2.8rem;

  > svg {
    height: 2.15rem;
    path {
      fill: white;
      width: auto;
      height: 100%;
    }
  }
`

export const BarIconsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 1.5rem;
  flex-grow: 1;

  > section {
    margin-bottom: 1rem;
    width: calc(100% - 1.6rem);
  }
`

export const BarButton = styled.button`
  width: 100%;
  padding: 0.95rem 0;
  border-radius: 1rem;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  &.active {
    background: rgba(255, 255, 255, 0.18);
  }

  > svg {
    color: white;
    height: 1.65rem;
    margin: 0 0.25rem;
  }
`

export const BarFooterWrapper = styled.div`
  width: calc(100% - 1.6rem);
  margin: 0 auto;
  padding: 1rem 0;
`
