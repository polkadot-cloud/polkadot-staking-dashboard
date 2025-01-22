// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const RewardText = styled.div`
  .content.chart {
    .labels {
      > div:first-child {
        color: var(--accent-color-primary);
      }
    }
  }
`

export const RewardsGrid = styled.div`
  padding: 1rem;

  .header {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 0.5rem;
    border-bottom: 1px solid var(--border-primary-color);
    font-weight: 500;
    color: var(--text-color-secondary);
  }

  .reward-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 0.75rem 0.5rem;
    border-bottom: 1px solid var(--border-secondary-color);

    &:last-child {
      border-bottom: none;
    }

    span {
      &:first-child {
        color: var(--text-color-secondary);
      }
      &:not(:first-child) {
        font-family: InterSemiBold, sans-serif;
      }
    }
  }
`

export const HistoryPlaceholder = styled.div`
  padding: 2rem;
  text-align: center;

  p {
    margin: 0;

    &.secondary {
      color: var(--text-color-secondary);
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }
  }
`
