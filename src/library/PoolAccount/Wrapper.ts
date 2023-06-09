// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import type { WrapperProps } from './types';

export const Wrapper = styled.button<WrapperProps>`
  cursor: ${(props) => (props.canClick ? 'pointer' : 'default')};
  background: ${(props) =>
    props.filled ? 'var(--button-tab-background)' : 'none'};
  font-size: ${(props) => props.fontSize};
  border-radius: 1rem;
  box-shadow: none;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding: 0 1rem;
  max-width: 250px;
  flex: 1;
  transition: transform var(--transition-duration) ease-out;

  &:hover {
    transform: scale(1.03);
  }

  .identicon {
    margin: 0.15rem 0.25rem 0 0;
  }

  .account-label {
    border-right: 1px solid var(--border-secondary-color);
    color: var(--text-color-primary);
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
  }

  .title {
    color: var(--text-color-primary);
    font-family: InterSemiBold, sans-serif;
    margin-left: 0.25rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 2.2rem;
    flex: 1;

    &.syncing {
      opacity: 0.4;
    }

    &.unassigned {
      color: var(--text-color-primary);
      opacity: 0.45;
    }
  }
`;
