// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const SearchInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 2rem;
  width: 100%;
  padding: 0 1rem 0rem 1rem;

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
