// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CardWrapper } from 'library/Card/Wrappers'
import styled from 'styled-components'

// Main container for the pool invite page
export const PoolInviteContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
`

// Card for displaying pool header information
export const PoolHeaderCard = styled(CardWrapper)`
  padding: 1.25rem;
  margin-bottom: 0;

  &.canvas {
    background: var(--background-canvas-card);
  }
`

// Pool header with logo and name
export const PoolHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;

  > div:first-child {
    margin-right: 0.75rem;
  }

  > div:last-child {
    h2 {
      margin: 0 0 0.15rem 0;
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--text-color-primary);
    }
    > div {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      color: var(--text-color-secondary);
      font-size: 0.85rem;
    }
  }
`

// Pool info section with ID and commission
export const PoolInfo = styled.div`
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  margin-bottom: 1rem;
`

// Stats section with two columns
export const StatsSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1.5rem 0;
`

// Individual stat column
export const StatColumn = styled.div`
  h4 {
    margin: 0;
    color: var(--text-color-secondary);
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  p {
    margin: 0.25rem 0 0 0;
    font-size: 1.2rem;
    color: var(--text-color-primary);
    font-family: 'Unbounded', sans-serif;
    font-weight: 400;
  }
`

// Section title
export const SectionTitle = styled.h3`
  margin: 1.5rem 0 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-color-primary);
`

// Addresses section
export const AddressesSection = styled.div`
  margin-top: 1rem;
`

// Address row with label and value
export const AddressRow = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: center;

  > div:first-child {
    width: 80px;
    font-size: 0.9rem;
    color: var(--text-color-secondary);
  }

  > div:last-child {
    flex: 1;
    display: flex;
    align-items: center;
  }
`

// Connect wallet card
export const ConnectWalletCard = styled(CardWrapper)`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;

  h3 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    font-family: 'Unbounded', sans-serif;
    font-size: 1.1rem;
  }

  p {
    margin: 0;
    opacity: 0.8;
  }

  .warning {
    background: var(--accent-color-warning-container);
    color: var(--accent-color-warning);
    padding: 0.75rem;
    border-radius: 0.75rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    line-height: 1.4;
  }
`

// Wrapper for loading state
export const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text-color-secondary);

  h3 {
    margin: 0.5rem 0;
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--text-color-primary);
  }

  p {
    margin: 0.5rem 0 0 0;
    font-size: 0.85rem;
    opacity: 0.8;
  }

  .spinner {
    color: var(--text-color-secondary);
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    animation: spin 1s infinite linear;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`

// Pool flag styling
export const PoolFlag = styled.span`
  font-size: 1rem;
  margin-left: 0.25rem;
`
