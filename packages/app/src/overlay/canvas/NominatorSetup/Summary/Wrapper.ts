// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const SummaryWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  margin-bottom: 1rem;

  > section {
    border-bottom: 1px solid var(--border-primary-color);
    flex-basis: 100%;
    display: flex;
    flex-flow: row wrap;
    margin-top: 0.5rem;
    padding: 0.5rem 0 1rem 0;

    &:first-child {
      margin-top: 0;
    }

    > div {
      display: flex;
      flex-flow: row wrap;

      &:first-child {
        width: 3.5rem;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        > svg {
          color: var(--accent-color-primary);
        }
      }

      &:last-child {
        flex-grow: 1;
        flex-direction: column;
        padding-left: 0.25rem;

        > h4 {
          color: var(--text-color-secondary);
          margin-bottom: 0.3rem;
        }
      }
    }
  }
`
