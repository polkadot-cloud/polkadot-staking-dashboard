// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
`

export const ItemWrapper = styled.div`
  padding: 0.5rem;
  width: 100%;

  > .inner {
    background: var(--bg-list);
    padding: 0 0.75rem;
    flex: 1;
    border-radius: 1rem;
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    flex: 1;
    max-width: 100%;

    > .row {
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      align-items: center;

      &:first-child {
        padding: 1rem 0 0.75rem 0;
      }

      &:last-child {
        border-top: 1px solid var(--gray-500);
        padding-top: 0rem;

        > div {
          min-height: 3.2rem;
        }
      }

      > div {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        flex: 1;
        max-width: 100%;

        h4 {
          color: var(--gray-900);
          font-family: var(--font-family-semibold);
          &.claim {
            color: var(--gray-1000);
          }
          &.reward {
            color: var(--gray-1000);
          }
        }

        h5 {
          color: var(--gray-900);
          &.claim {
            color: var(--gray-1000);
            border: 1px solid var(--gray-1000);
            border-radius: 0.75rem;
            padding: 0.2rem 0.5rem;
          }
          &.reward {
            color: var(--gray-1000);
            border: 1px solid var(--gray-1000);
            border-radius: 0.75rem;
            padding: 0.2rem 0.5rem;
          }
        }

        > div:first-child {
          flex-grow: 1;
          display: flex;
          flex-flow: row wrap;
          align-items: center;
        }

        > div:last-child {
          display: flex;
          flex-flow: row wrap;
          justify-content: flex-end;

          > h4 {
            color: var(--gray-900);
            opacity: 0.8;
          }
        }
      }
    }
  }
`
