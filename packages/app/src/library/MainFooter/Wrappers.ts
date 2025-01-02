// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const Wrapper = styled.div`
  --network-bar-font-size: 0.9rem;

  color: var(--text-color-secondary);
  font-size: var(--network-bar-font-size);
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  overflow: hidden;
  z-index: 6;
  backdrop-filter: blur(4px);
  padding-top: 0.15rem;
  padding-bottom: 1.25rem;
  width: 100%;
  margin: 0 auto;

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }
`

export const Summary = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  align-content: center;

  /* hide connection status text on small screens */
  .hide-small {
    display: flex;
    align-items: center;
    align-content: center;

    @media (max-width: 600px) {
      display: none;
    }
  }

  a,
  button {
    color: var(--text-color-secondary);
    font-size: var(--network-bar-font-size);
    opacity: 0.75;
  }
  p {
    font-size: var(--network-bar-font-size);
    border-left: 1px solid var(--text-color-secondary);
    margin: 0.25rem 0.5rem 0.25rem 0.15rem;
    padding-left: 0.5rem;
    line-height: 1.3rem;

    &:first-child {
      border-left: none;
    }
  }
  .stat {
    margin: 0 0.25rem;
    display: flex;
    align-items: center;

    &.last {
      margin-left: 1rem;
    }
  }

  /* left and right sections for each row*/
  > section {
    color: var(--text-color-secondary);
    padding: 0.5rem 0;

    /* left section */
    &:nth-child(1) {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      flex-grow: 1;
    }

    /* right section */
    &:last-child {
      flex-grow: 1;
      display: flex;
      align-items: center;
      flex-flow: row-reverse wrap;

      button {
        font-size: var(--network-bar-font-size);
        color: var(--text-color-secondary);
        border-radius: 0.4rem;
        padding: 0.25rem 0.5rem;
      }
      span {
        &.pos {
          color: #3eb955;
        }
        &.neg {
          color: #d2545d;
        }
      }
    }
  }
`

export const Separator = styled.div`
  border-left: 1px solid var(--text-color-secondary);
  opacity: 0.2;
  margin: 0 0.3rem;
  width: 1px;
  height: 1rem;
`
