// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion'
import styled from 'styled-components'

export const ListWrapper = styled(motion.div)`
  display: flex;
  flex-flow: row wrap;
  flex-grow: 1;
  overflow: auto;
  padding: 0.75rem 0.5rem;

  > button {
    color: var(--text-color-primary);
    padding: 0.25rem;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }
  h2 {
    color: var(--text-color-primary);
    padding: 0 0.75rem;
    margin: 0.5rem 0;
    width: 100%;
  }
  p {
    color: var(--text-color-primary);
  }
  .definition {
    color: var(--text-color-primary);
    padding: 0.75rem;
    line-height: 1.4rem;
    margin: 0;
  }
`

export const DefinitionWrapper = styled(motion.div)`
  background: var(--background-floating-card);
  border-radius: 1.5rem;
  display: flex;
  flex-flow: row wrap;
  overflow: hidden;
  margin-bottom: 1.25rem;
  padding: 1.5rem 1.5rem 0 1.5rem;
  width: 100%;

  button {
    padding: 0;
    h2 {
      margin: 0 0 1.5rem 0;
      display: flex;
      flex-flow: row wrap;
      align-items: center;

      > span {
        color: var(--text-color-secondary);
        margin-left: 0.75rem;
        opacity: 0.75;
        font-size: 1.1rem;
      }
    }
  }

  > div {
    position: relative;
    transition: height 0.4s cubic-bezier(0.1, 1, 0.2, 1);
    width: 100%;

    > .content {
      position: absolute;
    }

    h4 {
      font-family: InterSemiBold, sans-serif;
      margin-bottom: 1.15rem;
    }

    p {
      color: var(--text-color-primary);
      margin: 0.5rem 0 0 0;
      text-align: left;
    }

    p.icon {
      opacity: 0.5;
    }
  }
`

export const HelpTitle = styled.h1`
  font-family: Poppins700, sans-serif;
  margin: 1.75rem 0;
`

export const HelpSubtitle = styled.h3`
  font-family: InterSemiBold, sans-serif;
  margin: 2rem 0.5rem 1rem;
`

export const ItemWrapper = styled(motion.div)<{
  width: string | number
}>`
  display: flex;
  width: ${(props) => props.width};
  height: auto;
  overflow: hidden;
  flex-flow: row wrap;

  > * {
    background: var(--background-floating-card);
    border-radius: 1.5rem;
    flex: 1;
    padding: 1.5rem;
    display: flex;
    flex-flow: column nowrap;
    margin-bottom: 1.5rem;
    position: relative;

    > h2 {
      color: var(--text-color-primary);
      text-align: left;
    }
    > h4 {
      color: var(--text-color-primary);
      margin: 0.65rem 0;
      text-transform: uppercase;
      font-size: 0.7rem;
    }

    > p {
      color: var(--text-color-primary);
      text-align: left;

      &.icon {
        color: var(--accent-color-primary);
        margin-bottom: 0;
      }
    }

    .ext {
      margin-right: 0.75rem;
    }
  }
`

export const SupportLinks = styled.div`
  margin-top: 2.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  border-top: 1px solid var(--border-primary);
  padding-top: 1.5rem;
`

// Tab bar styles
export const TabBar = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-primary);
`

export const TabButton = styled.button<{ selected: boolean }>`
  background: none;
  border: none;
  outline: none;
  font-family: InterSemiBold, sans-serif;
  font-size: 1.1rem;
  color: ${(p) =>
    p.selected ? 'var(--accent-color-primary)' : 'var(--text-color-secondary)'};
  border-bottom: 2px solid
    ${(p) => (p.selected ? 'var(--accent-color-primary)' : 'transparent')};
  margin-right: 2rem;
  padding: 0.5rem 0;
  cursor: pointer;
  transition:
    color 0.2s,
    border-bottom 0.2s;
  display: flex;
  align-items: center;
  gap: 0.3em;

  svg {
    path {
      fill: ${(p) =>
        p.selected
          ? 'var(--accent-color-primary)'
          : 'var(--text-color-secondary)'};
    }
  }
`

// Enhanced support button with equal width and proper icon styling
export const StyledSupportButton = styled.a`
  display: inline-block;
  background: var(--accent-color-primary);
  color: #fff;
  font-weight: 600;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  margin-bottom: 0.75rem;
  transition: background 0.2s;
  width: 200px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;

  &:hover {
    background: var(--accent-color-primary-hover, #7b2ff2);
  }

  svg {
    path {
      fill: #fff;
    }
  }
`

export const SupportButton = styled.a`
  display: inline-block;
  background: var(--accent-color-primary);
  color: #fff;
  font-weight: 600;
  border-radius: 6px;
  padding: 0.5rem 1.25rem;
  text-decoration: none;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  transition: background 0.2s;
  &:hover {
    background: var(--accent-color-primary-hover, #7b2ff2);
  }
`
