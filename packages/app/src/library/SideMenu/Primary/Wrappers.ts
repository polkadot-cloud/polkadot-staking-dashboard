// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion'
import styled from 'styled-components'

export const Wrapper = styled(motion.div)`
  border: none;
  border-radius: 0.8rem;
  height: 3.2rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  margin: 0.4rem 0.2rem 0.3rem 0;
  padding: 0rem 0.5rem;
  position: relative;

  &.minimised {
    border: 1px solid rgba(255, 255, 255, 0);
    border-radius: 0.5rem;
    font-size: 1.1rem;
    justify-content: center;
    margin: 0.7rem 0.2rem 0.5rem 0;
    padding: 0.65rem 0rem;

    &.success,
    &.accent {
      border: 1px solid var(--accent-color-primary);
    }
    &.warning {
      border: 1px solid var(--accent-color-secondary);
    }
  }

  .dotlottie {
    color: var(--text-color-primary);
    margin-left: 0.25rem;
    margin-right: 0.5rem;
    width: 1.2rem;
    height: 1.2rem;
    .fa-icon {
      margin: 0 0.15rem;
    }
    &.minimised {
      margin: 0;
      width: 1.5rem;
      height: 1.5rem;
    }
  }
  .name {
    font-family: InterSemiBold, sans-serif;
    margin: 0;
    padding: 0;
    line-height: 1.35rem;
  }

  &.active {
    background: var(--highlight-primary);
  }
  &.inactive:hover {
    background: var(--highlight-secondary);
  }
`
