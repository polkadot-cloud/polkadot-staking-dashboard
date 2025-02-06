// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { memo } from 'react'
import styled, { keyframes } from 'styled-components'
import type { PieProps } from '../types'
import classes from './index.module.scss'

// Memoizing component to prevent animation restarts
export const Pie = memo(
  ({
    color1 = 'var(--accent-color-primary)',
    color2 = 'var(--background-default)',
  }: PieProps) => {
    // Define the keyframes for the pie
    const pie1Keyframes = keyframes`
    100% {
      stroke-dasharray: 10, 90, 0, 0;
      }
    `
    const pie2Keyframes = keyframes`
    100% {
      stroke-dasharray: 0, 10, 90, 0;
    }
  `

    // Define pie animations per segment
    const Wrapper = styled.div`
      > svg {
        > circle {
          animation: ${pie1Keyframes} 0.75s 1 cubic-bezier(0, 0.85, 0, 0.85)
            forwards;
          &:nth-child(1) {
            stroke: ${color1};
          }
          &:nth-child(2) {
            stroke: ${color2};
            animation-name: ${pie2Keyframes};
          }
        }
      }
    `

    return (
      <Wrapper className={classes.pie}>
        <svg viewBox="0 0 63.6619772368 63.6619772368">
          <circle cx="31.8309886184" cy="31.8309886184" r="15.9154943092" />
          <circle cx="31.8309886184" cy="31.8309886184" r="15.9154943092" />
        </svg>
      </Wrapper>
    )
  }
)
