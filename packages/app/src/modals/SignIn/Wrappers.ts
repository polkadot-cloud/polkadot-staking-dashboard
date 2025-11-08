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
  padding: 0.75rem 1rem;
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
    flex: 1;
  }

  .account-name {
    color: var(--text-color-primary);
    font-family: InterSemiBold, sans-serif;
    font-size: 1.2rem;
    flex: 1;
    width: 100%;
    padding: 0;
    margin-bottom: 0.5rem;
  }

  .account-address {
    font-size: 0.85rem;
    color: var(--text-color-secondary);
  }
`

export const DropdownMenu = styled.div`
  background: var(--background-primary);
  border: 1px solid var(--border-primary-color);
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  border-bottom-left-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 101;
  overflow: hidden;

  .accounts-list {
  }

  .account-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.9rem;
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
      gap: 0.5rem;
      flex: 1;
    }

    .account-name {
      color: var(--text-color-primary);
      font-family: InterSemiBold, sans-serif;
      font-size: 1.1rem;
    }

    .account-address {
      color: var(--text-color-secondary);
      font-size: 1rem;
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
