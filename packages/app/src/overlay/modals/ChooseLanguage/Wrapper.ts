// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const ContentWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;

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
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`

export const LocaleButton = styled.button<{ $connected: boolean }>`
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  border: 1px solid
    ${(props) =>
      props.$connected ? 'var(--accent-color-primary)' : 'transparent'};
  margin: 0.5rem 0;

  .selected {
    color: var(--accent-color-primary);
    margin-left: auto;
    font-size: 0.95rem;
  }

  &:hover {
    background: ${(props) =>
      props.$connected
        ? 'var(--background-floating-card)'
        : 'var(--button-hover-background)'};
  }
`
