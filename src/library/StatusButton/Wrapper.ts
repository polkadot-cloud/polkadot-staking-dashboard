// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.button`
  background: var(--button-primary-background);
  color: var(--text-color-primary);
  width: 100%;
  flex: 1;
  padding: 1rem 0.75rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  display: flex;
  flex-flow: row-reverse wrap;
  align-items: center;
  transition: all var(--transition-duration);

  > section:last-child {
    color: var(--text-color-secondary);
    padding-left: 0.25rem;
    display: flex;
    flex-flow: row wrap;
    flex: 1;
  }

  &:hover {
    > section {
      color: var(--text-color-primary);
    }
  }
`;
