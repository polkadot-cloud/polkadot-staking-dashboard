// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const CurrencyListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;

  .warning {
    color: var(--text-color-secondary);
    margin: 1rem 0;
    padding: 0.75rem;
    background: var(--background-primary);
    border-radius: 0.75rem;
    border: 1px solid var(--border-primary-color);
  }

  .items {
    box-sizing: border-box;
    position: relative;
    width: auto;
    border-radius: 0.75rem;
    overflow: hidden;
    overflow-y: auto;
    z-index: 1;
    width: 100%;
    margin: 1rem 0 1.5rem 0;
    max-height: 60vh;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`

export const CurrencyButton = styled.button<{ $connected: boolean }>`
  color: var(--text-color-primary);
  background: ${(props) =>
    props.$connected
      ? 'var(--background-floating-card)'
      : 'var(--button-primary-background)'};
  font-family: InterSemiBold, sans-serif;
  box-sizing: border-box;
  padding: 0.9rem 1rem;
  cursor: pointer;
  border-radius: 0.75rem;
  width: 100%;
  text-align: left;
  border: 1px solid
    ${(props) =>
      props.$connected ? 'var(--accent-color-primary)' : 'transparent'};
  position: relative;
  display: grid;
  grid-template-columns: 4.5rem 7rem 1fr auto;
  align-items: center;
  gap: 1rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .currency-symbol {
    font-size: 1.4rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding-left: 0.5rem;
  }

  .currency-code {
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--text-color-primary);
  }

  .currency-name {
    color: var(--text-color-secondary);
    font-family: InterLight, sans-serif;
    font-size: 1rem;
    font-weight: normal;
    padding-left: 0.5rem;
  }

  .selected {
    color: var(--accent-color-primary);
    font-size: 0.95rem;
    padding-right: 0.5rem;
  }

  &:hover {
    background: ${(props) =>
      props.$connected
        ? 'var(--background-floating-card)'
        : 'var(--button-hover-background)'};
  }
`
