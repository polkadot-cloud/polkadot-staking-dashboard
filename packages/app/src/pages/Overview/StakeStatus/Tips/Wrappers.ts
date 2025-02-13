// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SmallFontSizeMaxWidth } from 'consts'
import { motion } from 'framer-motion'
import styled from 'styled-components'

export const TipsWrapper = styled.div`
  width: 100%;
  display: flex;
  position: relative;
`

export const ItemsWrapper = styled(motion.div)`
  width: 100%;
  display: flex;
  justify-items: center;
  padding: 0.75rem 1.5rem 0.85rem 1.5rem;
`
export const ItemWrapper = styled(motion.div)`
  padding: 0 0.25rem;
  flex-basis: 100%;
  &:last-child {
    margin-right: 0.25rem;
  }
`

export const ItemInnerWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;

  > section {
    height: 100%;

    &:nth-child(1) {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      padding-top: 0.1rem;
    }

    &:nth-child(2) {
      display: flex;
      flex-flow: column nowrap;
      align-items: flex-start;
      justify-content: center;
      flex: 1;

      .desc {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;
        width: 100%;
        height: 1.85rem;
        position: relative;

        &.active {
          h4:hover {
            color: var(--accent-color-primary);
            .more {
              color: var(--accent-color-primary);
              opacity: 1;
            }
          }
        }

        > button {
          position: absolute;
          top: 0;
          left: 0;
          height: 1.85rem;
          max-width: 100%;
          width: auto;

          > h4 {
            color: var(--text-color-secondary);
            transition: color var(--transition-duration);
            font-family: Inter, sans-serif;
            text-align: left;
            font-size: 1.05rem;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            padding: 0.15rem 1.75rem 0rem 0;
            width: 100%;

            > svg {
              color: var(--text-color-secondary);
              transition: all var(--transition-duration);
              position: absolute;
              right: 0.2rem;
              top: 0.43rem;
              display: flex;
              align-items: center;
              font-size: 1rem;
              opacity: 0.5;
              margin-left: 0.4rem;
            }
          }
        }
      }
    }
  }
`

export const PageToggleWrapper = styled.div`
  color: var(--text-color-secondary);
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  margin-left: 0.5rem;
  height: 100%;

  > span {
    border-left: 1px solid var(--border-primary-color);
    height: inherit;

    > button {
      transition: color var(--transition-duration);
      opacity: 0.75;
      font-size: 1.1rem;
      height: 100%;
      padding: 0 1rem;

      > svg {
        color: var(--text-color-secondary);
      }
      &:hover {
        opacity: 1;
        color: var(--accent-color-primary);
        background-color: var(--background-default);
      }
      &:disabled {
        color: var(--text-color-secondary);
        opacity: var(--opacity-disabled);
      }
    }
  }

  h4 {
    color: var(--text-color-tertiary);

    @media (max-width: ${SmallFontSizeMaxWidth}px) {
      display: none;
    }
    margin: 0;
    margin-right: 0.5rem;
    > span {
      margin: 0 0.4rem;
    }
    &.disabled {
      opacity: var(--opacity-disabled);
    }
  }
`
