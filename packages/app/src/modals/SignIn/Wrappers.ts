// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;

  .account-selection {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    > h4 {
      margin: 0;
      color: var(--text-color-primary);
    }
  }

  .submit-section {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
`

export const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
`

export const DropdownButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: var(--background-floating-card);
  border: 1px solid var(--border-primary-color);
  border-radius: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.15s;

  &:hover {
    border-color: var(--accent-color-primary);
  }

  .selected-account {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
  }

  .account-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    flex: 1;
  }

  .account-name {
    font-weight: 600;
    color: var(--text-color-primary);
    flex: 1;
    width: 100%;
  }

  .account-address {
    font-size: 0.85rem;
    color: var(--text-color-secondary);
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas,
      'Courier New', monospace;
  }
`

export const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: var(--button-popover-tab-background);
  border: 1px solid var(--border-primary-color);
  border-radius: 0.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 101;
  overflow: hidden;

  .accounts-list {
    max-height: 300px;
    overflow-y: auto;
  }

  .account-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: var(--background-default);
    }

    &.selected {
      background: var(--background-default);
    }

    .account-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    }

    .account-name {
      font-weight: 500;
      color: var(--text-color-primary);
    }

    .account-address {
      font-size: 0.85rem;
      color: var(--text-color-secondary);
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas,
        'Courier New', monospace;
    }

    .account-source {
      font-size: 0.75rem;
      color: var(--text-color-secondary);
      background: var(--background-floating-card);
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
      text-transform: capitalize;
    }
  }

  .no-results {
    padding: 2rem;
    text-align: center;
    color: var(--text-color-secondary);
  }
`
