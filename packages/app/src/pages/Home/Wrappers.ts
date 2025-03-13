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

export const WelcomeWrapper = styled(Wrapper)`
  background: transparent;
  transition: all 0.2s;

  .welcome-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    h2 {
      margin: 0;
      margin-left: 0.75rem;
      color: var(--text-color-primary);
    }

    .wave-icon {
      color: var(--text-color-primary);
      fill: var(--text-color-primary);
      stroke: var(--text-color-primary);
      font-size: 1.5rem;
      width: 24px;
      height: 24px;
      transition: all 0.2s;

      path {
        fill: var(--text-color-primary);
        stroke: var(--text-color-primary);
      }

      * {
        color: var(--text-color-primary);
        fill: var(--text-color-primary);
        stroke: var(--text-color-primary);
      }
    }
  }

  .welcome-content {
    display: flex;
    flex-direction: column;

    .account-info {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      color: var(--text-color-primary);

      .account-address {
        font-family: monospace;
        background: var(--button-primary-background);
        color: var(--text-color-primary);
        padding: 0.5rem 0.75rem;
        border-radius: 0.5rem;
        margin-left: 0.5rem;
        font-size: 0.9rem;
        word-break: break-all;
      }
    }

    .welcome-message {
      margin-bottom: 1rem;
      line-height: 1.6;
      font-size: 1.2rem;
      font-weight: 500;
      color: var(--text-color-primary);
    }

    .features-list {
      margin-bottom: 1.5rem;

      h3 {
        font-size: 1.1rem;
        margin-bottom: 0.75rem;
        color: var(--text-color-secondary);
      }

      ul {
        list-style-type: none;
        padding-left: 0.5rem;
        margin: 0;

        li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          color: var(--text-color-primary);

          &:before {
            content: '•';
            color: var(--text-color-primary);
            font-weight: bold;
            position: absolute;
            left: 0;
            font-size: 1.2rem;
          }
        }
      }
    }

    .connect-prompt {
      display: flex;
      align-items: center;
      background: var(--background-floating-card);
      padding: 1rem;
      border-radius: 0.75rem;
      margin-top: 0.5rem;
      border: 1px solid var(--border-primary-color);
      transition: background 0.2s;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

      .wallet-icon {
        color: var(--text-color-primary);
        fill: var(--text-color-primary);
        font-size: 1.5rem;
        margin-right: 1rem;
        transition: color 0.2s;

        path {
          fill: var(--text-color-primary);
        }

        * {
          color: var(--text-color-primary);
          fill: var(--text-color-primary);
        }
      }

      p {
        margin: 0;
        font-weight: 500;
        color: var(--text-color-primary);
      }
    }
  }
`
