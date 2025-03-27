// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SectionFullWidthThreshold } from 'consts'
import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  max-width: 100%;
  overflow: hidden;

  /* Ensure all child elements respect container boundaries */
  > * {
    max-width: 100%;
    box-sizing: border-box;
  }
`

export const Spacer = styled.div`
  width: 100%;
  height: 1px;
  margin: 0.75rem 0;
`

export const Subheading = styled.div`
  margin: 0.4rem 0 1rem 0;

  h3,
  h4 {
    margin-top: 0;
    margin-left: 0;
    display: flex;
    align-items: center;

    > button {
      margin-left: 0.75rem;
    }
  }
`

export const ActionButtonsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 1rem;
  gap: 1rem;
`

export const WarningMessage = styled.div`
  background-color: var(--status-warning-color-transparent);
  color: var(--status-warning-color);
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`

export const ShareSection = styled.div`
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;

  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  p {
    color: var(--text-color-secondary);
    margin-bottom: 1rem;
  }

  @media (max-width: ${SectionFullWidthThreshold}px) {
    padding: 1rem;
  }
`

export const ShareUrl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: var(--background-secondary);
  border-radius: 0.5rem;
  padding: 0.75rem;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;

    > button {
      margin-top: 0.5rem;
      align-self: flex-start;
    }
  }
`

export const ShareUrlText = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
`

export const ValidatorListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  margin-top: 1.5rem;

  .validator-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    width: 100%;
  }

  .validator-item {
    background: var(--background-list-item);
    border-radius: 0.75rem;
    border: 1.5px solid var(--border-primary-color);
    overflow: hidden;
    position: relative;
    cursor: pointer;
    transition: all var(--transition-duration);
    padding: 0.75rem;

    &:hover {
      border-color: var(--accent-color-transparent);
      background-color: var(--background-list-item-hover);
    }

    &.selected {
      border-color: var(--accent-color-primary);
      background-color: var(--background-list-item-selected);
    }

    .validator-header {
      display: flex;
      align-items: center;
      width: 100%;

      .identity {
        display: flex;
        align-items: center;
        flex-grow: 1;
        margin-right: 0.5rem;
        overflow: hidden;

        .name {
          font-size: 0.95rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-left: 0.5rem;
        }
      }

      .validator-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin-right: 0.5rem;
        min-width: 80px;

        .commission-value {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-color-primary);
        }

        .status-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-size: 0.8rem;
          margin-top: 0.25rem;

          .status {
            &.active {
              color: var(--status-success-color);
            }
          }

          .dot-amount {
            color: var(--text-color-secondary);
            font-size: 0.75rem;
            margin-top: 0.1rem;
          }
        }
      }

      .actions {
        display: flex;
        align-items: center;
      }
    }
  }

  /* Ensure we have at most 8 validators per column */
  @media (min-width: 1024px) {
    .validator-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-auto-flow: column;
      grid-template-rows: repeat(8, auto);
    }
  }

  /* Responsive adjustments */
  @media (max-width: 1023px) {
    .validator-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 767px) {
    .validator-grid {
      grid-template-columns: 1fr;
    }
  }
`

export const ValidatorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  /* Ensure each grid item stays contained */
  > * {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
`

export const ValidatorCard = styled.div`
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 0.5rem;
  break-inside: avoid; /* Prevents cards from breaking across columns */

  /* Make sure content inside doesn't push the width */
  > * {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const LoadingState = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: var(--text-color-secondary);
  font-size: 1.2rem;
`

export const ErrorState = styled.div`
  text-align: center;
  padding: 3rem 0;

  h3 {
    color: var(--status-danger-color);
    margin-bottom: 1rem;
    font-size: 1.4rem;
  }

  p {
    color: var(--text-color-secondary);
    margin-bottom: 2rem;
  }
`
