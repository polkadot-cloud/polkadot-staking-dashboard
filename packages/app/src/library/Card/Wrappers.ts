// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageWidthMediumThreshold } from 'consts'
import styled from 'styled-components'
import type { CardWrapperProps } from '../Graphs/types'

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
  transition: border 0.2s;

  &.canvas {
    background: var(--background-canvas-card);
    padding: 1.25rem;

    &.secondary {
      padding: 1rem;

      @media (max-width: 1000px) {
        background: var(--background-canvas-card);
      }

      @media (min-width: 1001px) {
        background: var(--background-canvas-card-secondary);
      }
    }
  }

  &.transparent {
    background: none;
    border: none;
    border-radius: 0;
    box-shadow: none;
    margin-top: 0;
    padding: 0;
  }

  &.warning {
    border: 1px solid var(--accent-color-secondary);
  }

  &.prompt {
    border: 1px solid var(--accent-color-pending);
  }

  @media (max-width: ${PageWidthMediumThreshold}px) {
    padding: 1rem 0.75rem;
  }

  @media (min-width: ${PageWidthMediumThreshold + 1}px) {
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
      margin-left: 0;
      margin-bottom: 0.75rem;
    }

    h4 {
      margin-bottom: 0;
    }
  }
`
