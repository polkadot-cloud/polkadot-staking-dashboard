// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const SupportWrapper = styled.div`
  padding: 0 1.75rem 2rem 1.75rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  > svg {
    width: 100%;
    height: auto;
    max-width: 7rem;
  }

  > h1 {
    margin-top: 0.5rem;
    width: 100%;

    button {
      width: 100%;
      padding: 1rem;
      background: var(--background-primary);
      border: 1px solid var(--border-primary-color);
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background: var(--background-secondary);
      }

      &:disabled {
        cursor: not-allowed;
      }
    }
  }

  > h4 {
    padding: 2.5rem 1.5rem 0.75rem 1.5rem;
    text-align: center;
  }

  .feedback {
    color: var(--accent-color-primary);
    font-size: 0.9rem;
    margin-top: 0.5rem;
    opacity: 0;
    transition: opacity 0.2s;

    &.visible {
      opacity: 1;
    }
  }
`
