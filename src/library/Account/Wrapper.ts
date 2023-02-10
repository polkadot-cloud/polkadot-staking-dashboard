// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { WrapperProps } from './types';

export const Wrapper = styled.button<WrapperProps>`
  border: 1px solid var(--border-primary-color);
  cursor: ${(props) => (props.canClick ? 'pointer' : 'default')};
  background: ${(props) =>
    props.filled ? 'var(--button-secondary-background)' : 'none'};
  font-size: ${(props) => props.fontSize};
  border-radius: 1.25rem;
  box-shadow: none;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding: 0 1rem;
  max-width: 225px;
  flex: 1;
  transition: transform 0.15s ease-out;
  &:hover {
    transform: scale(1.03);
  }
  .identicon {
    margin: 0.15rem 0.25rem 0 0;
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
      color: var(--text-color-secondary);
    }
  }

  .title {
    color: var(--text-color-secondary);
    margin-left: 0.25rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 2.15rem;
    flex: 1;

    &.unassigned {
      color: var(--text-color-secondary);
      opacity: 0.45;
    }
  }

  .wallet {
    width: 1em;
    height: 1em;
    margin-left: 0.8rem;
    opacity: 0.8;

    path {
      fill: var(--text-color-secondary);
    }
  }
`;
