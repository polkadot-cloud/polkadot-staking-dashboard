// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { backgroundToggle, buttonPrimaryBackground } from 'theme';

export const ContentWrapper = styled.div`
  width: 100%;

  > h4 {
    color: var(--text-color-secondary);
    border-bottom: 1px solid var(--border-primary-color);
    margin: 0.75rem 0;
    padding-bottom: 0.5rem;
    width: 100%;
  }

  .items {
    position: relative;
    border-bottom: none;
    width: auto;
    border-radius: 0.75rem;
    overflow: hidden;
    overflow-y: auto;
    z-index: 1;
    width: 100%;
    margin: 1rem 0 1.5rem 0;

    h4 {
      margin: 0.2rem 0;
    }
    h2 {
      margin: 0.75rem 0;
    }
  }
`;

export const StyledButton = styled.button`
  background: ${buttonPrimaryBackground};
  padding: 1rem 1.2rem;
  cursor: pointer;
  margin-bottom: 1rem;
  border-radius: 1rem;
  display: inline-flex;
  flex-flow: row wrap;
  align-items: center;
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    margin: 0 0 0 0.25rem;
  }

  h4 {
    margin: 0;
    &.selected {
      color: var(--status-success-color);
      margin-left: 0.75rem;
    }
  }

  > *:last-child {
    flex: 1;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
  }
  &:hover {
    background: ${backgroundToggle};
  }
  .icon {
    margin-right: 0.75rem;
  }
  .details {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    > h4 {
      margin-left: 1rem;
      span {
        background: var(--background-primary-color);
        border: 1px solid var(--border-primary-color);
        margin-right: 0.5rem;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
      }
    }
  }

  svg {
    color: var(--text-color-secondary);
    fill: var(--text-color-secondary);
  }
  p {
    color: var(--text-color-primary);
    font-size: 1rem;
  }
`;
