// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageWidthMediumThreshold } from 'consts'
import styled from 'styled-components'

export const BaseWrapper = styled.div`
  background: var(--background-primary);
  border-radius: 1rem;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
`

export const StatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 1rem 0;

  @media (max-width: ${PageWidthMediumThreshold}px) {
    grid-template-columns: 1fr;
  }
`

export const OverviewCard = styled(BaseWrapper)`
  padding: 1.25rem;
  min-height: 9rem;
  height: 100%;
`

export const BalanceContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.5rem 0;

  .token-icon {
    width: 2.5rem;
    height: 2.5rem;
    flex-shrink: 0;
  }

  .balance-info {
    flex: 1;
    min-width: 0;

    .main-balance {
      font-size: 1.4rem;
      font-family: InterSemiBold, sans-serif;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .fiat-value {
      color: var(--text-color-secondary);
      font-size: 0.9rem;
      margin-top: 0.25rem;
    }
  }
`

export const CardContentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  min-width: 0;

  h3 {
    font-size: 1rem;
    color: var(--text-color-primary);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  svg {
    color: var(--text-color-secondary);
    opacity: 0.7;
    font-size: 0.9rem;
    flex-shrink: 0;
  }
`

export const MetricsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-secondary-color);

  .metric {
    flex: 1;

    .label {
      font-size: 0.85rem;
      color: var(--text-color-secondary);
      margin-bottom: 0.25rem;
    }

    .value {
      font-size: 1rem;
      font-family: InterSemiBold, sans-serif;
      word-break: break-all;
    }
  }
`

export const StatusBadge = styled.div<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${(props) =>
    props.$active ? 'var(--background-active)' : 'var(--background-inactive)'};
  border-radius: 0.5rem;
  font-size: 0.9rem;

  > div {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) =>
      props.$active
        ? 'var(--accent-color-primary)'
        : 'var(--text-color-secondary)'};
  }
`

export const ActionsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;

  > button {
    flex: 1;
    min-width: 140px;
    justify-content: center;

    @media (max-width: ${PageWidthMediumThreshold}px) {
      width: 100%;
    }
  }
`

export const WarningBox = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: var(--background-warning);
  border: 1px solid var(--border-warning);
  border-radius: 0.75rem;
  font-size: 0.9rem;
  color: var(--text-warning);
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;

  > svg {
    margin-top: 0.2rem;
  }
`

export const RecommendationCard = styled(BaseWrapper)`
  padding: 1.25rem;
`

export const PoolHealth = styled.span`
  color: var(--status-success);
  font-weight: 600; /* or 700 for bolder text */
`
