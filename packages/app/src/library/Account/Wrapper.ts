// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const Wrapper = styled.div`
  border: 1px solid var(--border-primary-color);
  transition: transform var(--transition-duration) ease-out;
  cursor: default;
  font-size: 1.1rem;
  border-radius: 1.5rem;
  box-shadow: none;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding: 0.1rem 1.25rem;
  max-width: 235px;
  flex: 1;
  cursor: pointer;

  &:hover {
    transform: scale(1.025);
  }
  .polkicon {
    margin: 0.15rem 0.25rem 0 0;
    max-width: 1.5rem;
  }
  .account-label {
    border-right: 1px solid var(--border-secondary-color);
    color: var(--text-color-secondary);
    font-size: 0.8em;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 0.5rem;
    padding-right: 0.5rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    flex-shrink: 1;

    > svg {
      color: var(--text-color-primary);
    }
  }

  .title {
    color: var(--text-color-secondary);
    font-family: InterSemiBold, sans-serif;
    margin-left: 0.25rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 2.25rem;
    flex: 1;

    &.syncing {
      opacity: 0.4;
    }

    &.unassigned {
      color: var(--text-color-secondary);
      opacity: 0.45;
    }
  }
`
