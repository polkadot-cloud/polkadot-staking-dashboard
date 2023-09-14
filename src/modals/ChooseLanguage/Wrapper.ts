// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const ContentWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;

  .items {
    box-sizing: border-box;
    position: relative;
    box-sizing: border-box;
    border-bottom: none;
    width: auto;
    border-radius: 0.75rem;
    overflow: hidden;
    overflow-y: auto;
    z-index: 1;
    width: 100%;
    margin: 1rem 0 1.5rem 0;
  }
`;

export const LocaleButton = styled.button<{ $connected: boolean }>`
  color: var(--text-color-primary);
  background: var(--button-primary-background);
  font-family: InterSemiBold, sans-serif;
  box-sizing: border-box;
  padding: 1rem;
  cursor: pointer;
  border-radius: 0.75rem;
  display: inline-flex;
  flex-flow: row wrap;
  align-items: center;
  width: 100%;
  border: 1px solid var(--status-success-color-transparent);
  margin: 0.5rem 0;
  ${(props) =>
    props.$connected !== true &&
    `
  border: 1px solid rgba(0,0,0,0);
`}

  h4 {
    color: var(--text-color-secondary);
    &.selected {
      color: var(--status-success-color);
      margin-left: 0.75rem;
    }
  }
  &:hover {
    background: var(--button-hover-background);
  }
`;
