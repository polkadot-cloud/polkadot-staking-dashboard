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

export const DropdownButton = styled.button`
  width: 100%;
  padding: 0 .8rem;
  height: 4.75rem;
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

    &:focus {
      padding: 0;
      min-height: 4.75rem;
    }

    &::placeholder {
      opacity: 0.65;
    }
  }

  .account-address {
    color: var(--text-color-tertiary);
    margin-top: 0.5rem;
    font-size: 1rem;
  }

  .account-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    margin-left: 0.5rem;

    h4 {
      color: var(--text-color-secondary);
      font-size: 0.95rem;
    }
    > .icon {
      width: 1.25rem;
      height: 1.25rem;
      margin-top: 0.5rem;
      
      svg {
        width: 100%;
        height: 100%;
      }
    }
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
    padding: 1rem 1.25rem;
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
      color: var(--text-color-tertiary);
      font-size: 1rem;
    }

    .account-source-icon {
      width: 1.1rem;
      height: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 100%;
        height: 100%;
      }
    }
  }

  .no-results {
    padding: 2rem;
    text-align: center;
    color: var(--text-color-secondary);
  }
`
