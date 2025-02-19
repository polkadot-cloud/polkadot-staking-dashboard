// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion'
import styled from 'styled-components'
import type { MinimisedProps } from '../types'

export const Wrapper = styled(motion.button)<MinimisedProps>`
  border: 1px solid var(--border-secondary-color);
  border-radius: 0.8rem;
  height: 3.3rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  position: relative;
  padding: 0rem 0.5rem;
  margin: 0.8rem 0.2rem 1rem 0;
  width: 100%;

  .name {
    color: var(--text-color-secondary);
    font-family: InterSemiBold, sans-serif;
    font-size: 1.1rem;
  }
  .light {
    color: var(--text-color-primary);
    margin-left: 0.2rem;
  }

  &.active {
    background: var(--highlight-primary);
  }
  &.inactive:hover {
    background: var(--highlight-secondary);
  }
  &.success {
    border: 1px solid var(--status-success-color-transparent);
  }
  &.warning {
    border: 1px solid var(--status-warning-color-transparent);
  }
  &.danger {
    border: 1px solid var(--status-danger-color-transparent);
  }
`

export const MinimisedWrapper = styled(motion.button)`
  border: 1px solid var(--border-secondary-color);
  border-radius: 0.7rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0;
  margin: 0.6rem 0 1.15rem 0;
  min-height: 3.2rem;
  width: 100%;

  &.active {
    background: var(--highlight-primary);
  }
  &.inactive:hover {
    background: var(--highlight-secondary);
  }
  .icon {
    margin: 0;
  }

  &.success {
    border: 1px solid var(--status-success-color-transparent);
  }
  &.warning {
    border: 1px solid var(--status-warning-color-transparent);
  }
  &.danger {
    border: 1px solid var(--status-danger-color-transparent);
  }
`

export const IconWrapper = styled.div<{ $minimised: boolean }>`
  height: 2rem;
  display: flex;
  align-items: center;
  margin-left: ${(props) => (props.$minimised ? 0 : '0.25rem')};
  margin-right: ${(props) => (props.$minimised ? 0 : '0.65rem')};

  svg {
    .primary {
      fill: var(--text-color-primary);
    }
  }
`
