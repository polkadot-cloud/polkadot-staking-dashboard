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

  .validator-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    width: 100%;
  }

  .validator-card {
    flex: 1;
    min-width: 300px;
    flex-basis: calc(50% - 0.5rem);
    background: var(--button-primary-background);
    border-radius: 1rem;
    transition: all var(--transition-duration);
    cursor: pointer;
    overflow: hidden;
    position: relative;

    @media (max-width: 1024px) {
      flex-basis: 100%;
    }

    &:hover {
      background: var(--button-hover-background);
    }

    &.selected {
      background: var(--background-floating-card);
      box-shadow: 0 0 0.75rem var(--shadow-primary);
    }

    .card-header {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid var(--border-primary-color);

      .checkbox-wrapper {
        margin-right: 0.75rem;

        input[type='checkbox'] {
          width: 1.2rem;
          height: 1.2rem;
          cursor: pointer;
        }
      }

      .identity {
        display: flex;
        align-items: center;
        flex-grow: 1;
        gap: 0.75rem;

        .name {
          font-size: 1rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .actions {
        display: flex;
        align-items: center;
      }
    }

    .card-content {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      .era-points {
        width: 100%;
        height: 60px;
      }

      .metrics {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.5rem;

        .commission,
        .status {
          display: flex;
          align-items: center;
          font-size: 0.9rem;
          color: var(--text-color-secondary);
          background: var(--background-primary);
          padding: 0.4rem 0.75rem;
          border-radius: 0.5rem;

          span {
            margin-left: 0.25rem;
          }
        }
      }
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
