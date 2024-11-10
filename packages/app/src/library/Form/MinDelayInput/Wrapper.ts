// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const MinDelayInputWrapper = styled.div`
  color: var(--text-color-secondary);
  border: 1px solid var(--border-primary-color);
  flex: 0 1 auto;
  display: flex;
  height: 3rem;
  align-items: center;
  margin: 0.5rem 1rem 0 0;
  border-radius: 0.75rem;
  overflow: hidden;

  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }

  > .input {
    flex-grow: 1;
    padding-right: 0.75rem;

    input {
      font-family: InterSemiBold, sans-serif;
      width: 32px;
      margin: 0 0.6rem 0 0;
      padding: 0.5rem 0.2rem 0.5rem 0.75rem;
    }
  }

  > .toggle {
    background: var(--button-primary-background);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 1.5rem;

    > button {
      color: var(--text-color-secondary);
      height: 1.5rem;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      &:first-child {
        padding-top: 0.3rem;
      }
      &:last-child {
        padding-bottom: 0.3rem;
      }

      &:hover {
        background: var(--button-secondary-background);
      }
    }
  }
`;
