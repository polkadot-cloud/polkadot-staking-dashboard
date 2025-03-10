// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const Wrapper = styled.div`
  padding: 1rem;

  .content {
    width: 100%;

    h2 {
      margin-top: 0;
      margin-bottom: 1rem;
    }

    h3 {
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }

    p {
      margin-bottom: 1rem;
    }

    .balance-info,
    .recommendation,
    .benefits,
    .tips,
    .warning {
      margin-bottom: 1.5rem;
    }

    .warning {
      background: var(--background-warning);
      padding: 1rem;
      border-radius: 0.75rem;

      h3 {
        margin-top: 0;
        color: var(--text-warning);
      }
    }

    .balance-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .actions {
      margin-top: 1.5rem;
    }

    .options-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;

      @media (min-width: 768px) {
        flex-direction: row;
        gap: 3rem;
      }

      .option {
        flex: 1;

        h2 {
          margin-top: 0;
        }
      }
    }

    ul {
      padding-left: 1.5rem;

      li {
        margin-bottom: 0.5rem;
      }
    }
  }
`
