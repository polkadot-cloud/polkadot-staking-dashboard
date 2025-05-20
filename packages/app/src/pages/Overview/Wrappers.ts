// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SectionFullWidthThreshold } from 'consts'
import styled from 'styled-components'

export const Separator = styled.div`
  border-bottom: 1px solid var(--border-primary-color);
  margin-top: 0.8rem;
  width: 100%;
  height: 1px;
`

export const MoreWrapper = styled.div`
  padding: 0 0.5rem;
  padding-bottom: 1rem;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  margin-top: 2.25rem;

  @media (max-width: ${SectionFullWidthThreshold}px) {
    margin-top: 1.5rem;
    padding: 0 0.75rem;
    margin-bottom: 0.5rem;
  }
  h4 {
    margin-top: 0.25rem;
    margin-bottom: 0.5rem;
  }
  section {
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 0.1rem;
    div {
      margin-left: 0.5rem;
    }
  }
`

export const BannerWrapper = styled.div`
  &.light {
    border: 1px solid var(--accent-color-primary);
    background: var(--background-primary);

    .label,
    > div h3 {
      color: var(--accent-color-primary);
    }
  }
  &.dark {
    border: 1px solid var(--border-secondary-color);
    background: var(--accent-color-secondary);

    .label,
    > div h3 {
      color: white;
    }
    div > button {
      color: white;
      border-color: white;
    }
  }
  box-shadow: var(--card-shadow-secondary);
  border-radius: 1.25rem;
  padding: 1.25rem 1.5rem;
  margin-top: 5rem;
  width: 100%;

  .label {
    color: white;
    margin-bottom: 0.75rem;

    .icon {
      margin-right: 0.35rem;
    }
  }

  > div {
    display: flex;
    align-items: center;

    h3 {
      line-height: 1.8rem;
    }
    button {
      flex-basis: auto;
      font-size: 1.1rem;
      margin-left: 0.75rem;
    }
    @media (max-width: 800px) {
      flex-direction: column;
      align-items: flex-start;

      button {
        margin-top: 0.75rem;
        margin-left: 0;
        position: relative;
        left: -0.5rem;
      }
    }
  }
`

// Container for Quick Actions buttons
export const QuickActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: row nowrap;
  height: 100%;

  @media (max-width: 950px) {
    flex-wrap: wrap;
  }
`

// Container for help options that appear side by side in the same space as one button
export const HelpOptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
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
  padding: 1.25rem;
  height: 6.45rem;
  text-align: center;
  background: var(--button-popover-tab-background);
  border-top: 1px solid var(--border-primary-color);
  border-right: 1px solid var(--border-primary-color);
  cursor: pointer;
  transition: all 0.2s;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  flex: 1;

  @media (max-width: 1150px) {
    min-width: 12rem;
  }

  &:hover {
    background: ${(props) =>
      props.disabled
        ? 'var(--button-primary-background)'
        : 'var(--button-hover-background)'};
  }

  .icon {
    font-size: 1.5rem;
    margin-bottom: 0.6rem;
    color: var(--network-color-primary);
  }

  .label {
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
