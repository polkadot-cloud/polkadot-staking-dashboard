// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const ContentWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  border-radius: 1rem;
  width: 100%;

  > div:last-child {
    margin-bottom: 0;
  }
`

export const ChunkWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column wrap;
  margin-top: 1.25rem;

  > div {
    background: var(--btn-bg);
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 1rem;

    > .chunk-header {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    > .chunk-footer {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.6rem;

      > .era-label {
        color: var(--text-secondary);
        font-size: 0.88rem;
      }

      > .time-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 0.5rem;
        padding: 0.25rem 0.6rem;
        font-size: 0.82rem;
        color: var(--text-secondary);
      }

      > .unlocked-label {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        color: var(--status-success);
        font-family: var(--font-family-semibold);
        font-size: 0.88rem;
      }
    }
  }

  h2 {
    margin: 0;
  }
`
