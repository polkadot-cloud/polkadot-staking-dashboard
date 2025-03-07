// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const SearchInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 2rem;
  width: 100%;
  padding: 0 1rem 1rem 1rem;

  input {
    border-bottom: 1px solid var(--border-primary-color);
    color: var(--text-color-primary);
    width: 100%;
    padding: 0.5rem 0;
    font-size: 1.2rem;
    outline: none;
    transition:
      border-color 0.2s,
      background-color 0.2s;

    &:focus {
      border-color: var(--accent-color-primary);
    }

    &::placeholder {
      color: var(--text-color-tertiary);
      opacity: 0.7;
    }
  }
`

export const CurrencyListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  max-height: 50vh;
  min-height: 50vh;

  > .inner {
    position: relative;
    width: auto;
    overflow: hidden;
    overflow-y: auto;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin: 0;
  }

  > .inner > button:last-child {
    margin-bottom: 1rem;
  }
`
