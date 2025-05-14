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
  height: 100%;
  display: flex;
  flex-direction: column;

  .welcome-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0 0.5rem;

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
    padding: 0 0.5rem 0.5rem 0.5rem;
    flex: 1;

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
  padding: 0.75rem 1rem;
  height: 100%;
`

// Container for help options that appear side by side in the same space as one button
export const HelpOptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  height: 100%;
  width: 100%;

  &.rewards-options {
    .reward-option {
      .icon {
        color: var(--network-color-primary);
      }
    }
  }

  .help-option,
  .reward-option {
    padding: 1rem 0.5rem;
  }
`

// Styled button for Quick Actions
export const ActionButton = styled.button<{ $expanded?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 1rem;
  min-height: 5.5rem;
  height: 100%;
  text-align: center;
  background: var(--button-primary-background);
  border: 1px solid var(--border-primary-color);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background: ${(props) =>
      props.disabled
        ? 'var(--button-primary-background)'
        : 'var(--button-hover-background)'};
  }

  .icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--network-color-primary);
  }

  .label {
    font-weight: 600;
    font-size: 1rem;
    color: var(--text-color-primary);
  }

  /* Highlight the button when expanded */
  ${(props) =>
    props.$expanded &&
    `
    background: var(--button-hover-background);
    border-color: var(--border-primary-color);
  `}
`

// Grid layout for Welcome Section and Quick Actions
export const HeaderGridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1rem;

  .welcome-section {
    height: 100%;
  }

  .quick-actions-card {
    height: 100%;
  }

  @media (max-width: 992px) {
    grid-template-columns: 1fr;

    .welcome-section,
    .quick-actions-card {
      height: auto;
    }
  }
`

// Balance Cards Layout
export const BalanceCardsLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`

// Compact Stake Info component styling
export const CompactStakeInfoWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  /* Make card header more compact */
  .ui-card-header {
    padding-bottom: 0.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stake-info-content {
    padding: 0.5rem 1rem 0.75rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0rem;
  }

  .stake-info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.85rem 0;
    border-bottom: 1px solid var(--border-primary-color);

    &:last-child {
      border-bottom: none;
    }

    .stake-info-label {
      color: var(--text-color-secondary);
      font-size: 0.95rem;
      font-weight: 500;
    }
  }

  .stake-info-manage {
    margin-top: 0.5rem;
    display: flex;
    justify-content: flex-end;
  }
`

// Value display in the compact stake info component
export const StakeInfoValueWrapper = styled.div`
  display: flex;
  align-items: center;
  text-align: right;
  justify-content: flex-end;
  max-width: 70%;

  .value {
    font-family: InterSemiBold, sans-serif;
    font-size: 1.05rem;
    color: var(--text-color-primary);
    margin-right: 0.25rem;
    font-weight: 500;
  }

  .unit {
    color: var(--text-color-secondary);
    font-size: 0.9rem;
  }

  .status {
    color: var(--text-color-primary);
    font-size: 0.95rem;
    text-align: right;
  }
`
