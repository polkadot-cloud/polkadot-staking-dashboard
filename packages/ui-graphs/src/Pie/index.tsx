// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { memo } from 'react'
import styled, { keyframes } from 'styled-components'
import classes from './index.module.scss'
import type { Props } from './types'

// Memoizing component to prevent animation restarts
export const Pie = memo(({ value = 0, size = '2rem' }: Props) => {
  const inactive = 100 - value
  const activeColor = 'var(--accent-color-primary)'
  const inactiveColor = 'var(--background-default)'

  // Define the keyframes for the pie
  const pie1Keyframes = keyframes`
    100% {
      stroke-dasharray: ${value}, ${inactive}, 0, 0;
      }
    `

  // Define pie animations per segment
  const Wrapper = styled.div`
    > svg {
      > circle {
        &:nth-child(1) {
          stroke: ${inactiveColor};
          stroke-dasharray: 100, 0, 0, 0;
          z-index: 0;
        }
        &:nth-child(2) {
          animation: ${pie1Keyframes} 0.75s 1 cubic-bezier(0, 0.85, 0, 0.85)
            forwards;
          stroke: ${activeColor};
          z-index: 1;
        }
      }
    }
  `

  return (
    <Wrapper className={classes.pie} style={{ width: size, height: size }}>
      <svg viewBox="0 0 63.6619772368 63.6619772368">
        <circle cx="31.8309886184" cy="31.8309886184" r="15.9154943092" />
        <circle cx="31.8309886184" cy="31.8309886184" r="15.9154943092" />
      </svg>
    </Wrapper>
  )
})
