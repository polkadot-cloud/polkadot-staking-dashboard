// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const HealthStatus = styled.div`
  margin: 1.5rem 0;
  padding: 1.25rem;
  border-radius: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 1.1rem;

  &.very-healthy {
    background-color: rgba(0, 180, 0, 0.15);
    color: var(--text-color-primary);
  }

  &.healthy {
    background-color: rgba(0, 150, 0, 0.1);
    color: var(--text-color-primary);
  }

  &.unhealthy {
    background-color: rgba(220, 0, 0, 0.1);
    color: var(--text-color-primary);
  }

  &:before {
    content: '';
    display: inline-block;
    width: 0.85rem;
    height: 0.85rem;
    border-radius: 50%;
    margin-right: 0.75rem;
  }

  &.very-healthy:before {
    background-color: #2ecc71;
  }

  &.healthy:before {
    background-color: #27ae60;
  }

  &.unhealthy:before {
    background-color: #e74c3c;
  }
`

export const SectionTitle = styled.h3`
  color: var(--text-color-primary);
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: 600;
`

export const TipsList = styled.ul`
  padding-left: 1.5rem;
  margin-bottom: 2rem;

  li {
    margin-bottom: 0.75rem;
    color: var(--text-color-secondary);
    line-height: 1.4;
    font-size: 1.05rem;
  }
`

export const AnalyticsContainer = styled.div`
  background: var(--background-secondary);
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin: 1rem 0;
`

export const AnalyticsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-primary-color);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`

export const AnalyticsLabel = styled.div`
  color: var(--text-color-secondary);
  font-size: 1rem;
`

export const AnalyticsValue = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`

export const AlertBox = styled.div`
  background: rgba(220, 0, 0, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const QuickActionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`

export const QuickActionButton = styled.button`
  background: var(--background-secondary);
  border: 1px solid var(--border-primary-color);
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--background-hover);
  }
`
