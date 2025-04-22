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

export const WelcomeWrapper = styled.div`
  background: transparent;
  width: 100%;

  .welcome-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    .wave-icon {
      width: 1.75rem;
      height: 1.75rem;
      margin-right: 0.75rem;
      color: var(--text-color-primary);
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

    h2 {
      font-size: 1.5rem;
      color: var(--text-color-primary);
      margin: 0;
    }
  }

  .welcome-content {
    color: var(--text-color-secondary);
    line-height: 1.5;

    .account-info {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      font-size: 1.1rem;

      .account-address-container {
        display: flex;
        align-items: center;
        background: var(--button-primary-background);
        padding: 0.5rem 0.75rem;
        border-radius: 0.5rem;
        margin-left: 0.5rem;
        .account-address {
          font-family: monospace;
          word-break: break-all;
          margin-right: 0.5rem;
          color: var(--text-color-primary);
          font-size: 0.9rem;
        }
      }
    }

    .welcome-message {
      margin-bottom: 1.5rem;
    }

    .features-list {
      margin-bottom: 1.5rem;

      h3 {
        font-size: 1.2rem;
        color: var(--text-color-primary);
        margin-bottom: 0.75rem;
      }

      ul {
        padding-left: 1.5rem;
        margin: 0;

        li {
          margin-bottom: 0.5rem;
        }
      }
    }

    .connect-prompt {
      display: flex;
      align-items: center;
      background-color: var(--background-primary);
      padding: 1rem;
      border-radius: 0.75rem;
      box-shadow: var(--card-shadow-secondary);

      .wallet-icon {
        font-size: 1.5rem;
        margin-right: 1rem;
        color: var(--text-color-primary);
      }

      p {
        margin: 0;
        font-weight: 500;
      }
    }
  }
`

export const HomeWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  width: 100%;
`

export const CardRow = styled.div`
  display: flex;
  width: 100%;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`

export const LeftColumn = styled.div`
  flex: 0.4;
  display: flex;
`

export const RightColumn = styled.div`
  flex: 0.6;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

// Grid layout for Wallet Balance and Quick Actions
export const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  width: 100%;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`

// Container for Quick Actions buttons
export const QuickActionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 0.5rem;
`

// Container for help options that appear side by side in the same space as one button
export const HelpOptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  height: 100%;
  width: 100%;
`

// Styled button for Quick Actions
export const ActionButton = styled.button<{ $expanded?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  height: 100%;
  text-align: center;
  background: var(--button-primary-background);
  border: 1px solid var(--border-primary-color);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;

  &:hover {
    background: var(--button-hover-background);
  }

  &.help-button {
    /* Standard styling, same as other buttons */
  }

  &.help-option {
    animation: expandOption 0.3s ease-in-out forwards;
  }

  .icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--network-color-primary);
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;

    svg {
      color: var(--network-color-primary);
      fill: var(--network-color-primary);

      /* Force the Discord SVG to use the correct color */
      .primary {
        fill: var(--network-color-primary);
      }

      path {
        fill: var(--network-color-primary);
      }
    }
  }

  .label {
    font-weight: 600;
    font-size: 1rem;
    color: var(--text-color-primary);
  }

  @keyframes expandOption {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`
