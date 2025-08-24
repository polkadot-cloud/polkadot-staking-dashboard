// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageWidthMediumThreshold } from 'consts'
import { motion } from 'framer-motion'
import styled from 'styled-components'

export const MenuWrapper = styled.div`
  display: none;

  @media (max-width: ${PageWidthMediumThreshold}px) {
    color: var(--text-color-secondary);
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }
`

export const Item = styled.button`
  flex-grow: 1;
  padding: 0.05rem 1rem;
  border-radius: 1.5rem;
  box-shadow: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.05rem;
  transition: transform var(--transition-duration) ease-out;


  .label {
    color: var(--accent-color-primary);
    border: 0.125rem solid var(--accent-color-primary);
    border-radius: 0.8rem;
    font-size: 0.85rem;
    margin-right: 0.6rem;
    padding: 0.1rem 0.5rem;
  }

  > span {
    color: white;
    line-height: 2.2rem;
    .icon {
      cursor: pointer;
      color: var(--text-color-primary);
      transition: color var(--transition-duration);

      &:hover {
        color: var(--accent-color-primary);
      }
    }
  }

  &.connect {
    background: var(--accent-color-primary);
    > span {
      color: white;
    }
    .icon {
      margin-right: 0.6rem;
      path {
        fill: white;
      }
    }
  }
`

export const ItemInactive = styled(motion.div)`
  background: var(--button-secondary-background);
  flex-grow: 1;
  padding: 0 1rem;
  border-radius: 1rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  font-size: 1rem;

  > span {
    color: var(--text-color-primary);
    line-height: 2.2rem;
  }
`

export const LargeScreensOnly = styled.div`
  display: flex;
  @media (max-width: 850px) {
    display: none;
  }
`
