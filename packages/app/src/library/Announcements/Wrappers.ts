// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SmallFontSizeMaxWidth } from 'consts'
import { motion } from 'framer-motion'
import styled from 'styled-components'

export const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column wrap;
  width: 100%;
`

export const HeaderWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  width: 100%;

  @media (min-width: ${SmallFontSizeMaxWidth + 225}px) {
    margin-bottom: 1rem;
  }

  > div {
    border-right: 0;
    flex-basis: 100%;
    flex-grow: 1;
    margin-bottom: 0.5rem;

    &:last-child {
      border-right: 0;
    }

    @media (min-width: ${SmallFontSizeMaxWidth + 225}px) {
      border-right: 1px solid var(--border-primary-color);
      flex-basis: 25%;
      margin-bottom: 0;
      padding-left: 1rem;
      padding-right: 1rem;
      max-width: 275px;

      &:last-child {
        max-width: none;
      }
    }

    > .inner {
      border-bottom: 1px solid var(--border-primary-color);
      display: flex;
      flex-flow: column wrap;
      padding: 0.5rem 0.5rem 1rem 0.5rem;

      @media (min-width: ${SmallFontSizeMaxWidth + 225}px) {
        margin-bottom: 0;
      }

      h2 {
        color: var(--accent-color-primary);
        display: flex;
        align-items: center;

        > button {
          color: var(--accent-color-primary);
          margin-left: 0.75rem;
        }
      }

      h4 {
        color: var(--text-color-secondary);
        font-family: Inter, sans-serif;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        margin-top: 0.45rem;
      }
    }

    &:first-child {
      padding-left: 0;
    }
    &:last-child {
      padding-right: 0;
    }
  }
`

export const Item = styled(motion.div)`
  border-bottom: 1px solid var(--border-primary-color);
  list-style: none;
  flex: 1;
  margin-bottom: 1rem;
  padding: 0.75rem;
  padding-bottom: 1.5rem;

  &:last-child {
    border-bottom: 0;
    margin-bottom: 0;
  }

  h4 {
    font-family: InterSemiBold, sans-serif;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin: 0 0 0.5rem;
    padding-bottom: 0.2rem;

    &.neutral {
      color: var(--accent-color-primary);
    }
    &.danger {
      color: #d2545d;
    }
    &.warning {
      color: #b5a200;
    }
    &.pools {
      color: var(--accent-color-secondary);
    }
  }

  p {
    color: var(--text-color-secondary);
    margin: 0;
    line-height: 1.2rem;
  }
`
