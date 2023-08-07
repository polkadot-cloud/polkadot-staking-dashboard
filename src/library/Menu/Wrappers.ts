// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';
import { FloatingMenuWidth } from 'consts';

export const Wrapper = styled.div`
  background: var(--background-default);
  width: ${FloatingMenuWidth}px;
  padding: 0.25rem 0.75rem;
  display: flex;
  flex-flow: column wrap;
  transition: opacity var(--transition-duration);
  border-radius: 1rem;

  > button:last-child {
    border: none;
  }
`;

export const ItemWrapper = styled.button`
  border-bottom: 1px solid var(--border-primary-color);
  color: var(--text-color-secondary);
  display: flex;
  width: 100%;
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;

  &:hover {
    opacity: 0.75;
  }

  .title {
    color: var(--text-color-secondary);
    padding: 0 0 0 0.75rem;
    font-size: 1rem;
  }
`;
